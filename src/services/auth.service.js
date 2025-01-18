import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import repository from '../database/repository.js';
import ApiError from '../utils/ApiError.js';
import { getUserByEmail } from './user.service.js';
import { verifyToken, generateAuthTokens } from './token.service.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
  const refreshTokenDoc = await repository.findOne('token', {
    token: refreshToken,
    type: 'REFRESH',
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  await repository.updateOne('token', { id: refreshTokenDoc.id }, { blacklisted: true });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, 'REFRESH');
    const user = await repository.findUnique('user', { id: refreshTokenDoc.userId });
    if (!user) {
      throw new Error();
    }
    await repository.deleteOne('token', { id: refreshTokenDoc.id });
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, 'RESET_PASSWORD');
    const user = await repository.findUnique('user', { id: resetPasswordTokenDoc.userId });
    if (!user) {
      throw new Error();
    }
    await repository.updateOne('user', { id: user.id }, {
      password: await bcrypt.hash(newPassword, 8),
    });
    await repository.deleteMany('token', { userId: user.id, type: 'RESET_PASSWORD' });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, 'VERIFY_EMAIL');
    const user = await repository.findUnique('user', { id: verifyEmailTokenDoc.userId });
    if (!user) {
      throw new Error();
    }
    await repository.updateOne('user', { id: user.id }, { isEmailVerified: true });
    await repository.deleteMany('token', { userId: user.id, type: 'VERIFY_EMAIL' });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};