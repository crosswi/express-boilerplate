import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import repository from '../database/repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
export const createUser = async (userBody) => {
  if (await repository.findOne('user', { email: userBody.email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userBody.password, 8);

  return repository.create('user', {
    ...userBody,
    password: hashedPassword,
  });
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
export const getUserById = async (id) => {
  const user = await repository.findUnique('user', { id });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
export const getUserByEmail = async (email) => {
  return repository.findUnique('user', { email });
};

/**
 * Update user
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
export const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);

  if (updateBody.email && (await repository.findOne('user', { email: updateBody.email, id: { not: userId } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Hash password if it's being updated
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }

  return repository.updateOne('user', { id: user.id }, updateBody);
};

/**
 * Delete user
 * @param {string} userId
 * @returns {Promise<User>}
 */
export const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  await repository.deleteOne('user', { id: user.id });
  return user;
};

/**
 * Get users with pagination
 * @param {Object} filter - Prisma where conditions
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page
 * @param {number} [options.page] - Current page
 * @returns {Promise<{ users: User[], totalPages: number, totalResults: number }>}
 */
export const queryUsers = async (filter, options) => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [users, totalResults] = await Promise.all([
    repository.findMany('user', filter, {
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
    repository.count('user', filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    users,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  queryUsers,
};