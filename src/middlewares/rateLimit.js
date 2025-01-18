import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 100,
  endpoint = "API"
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    handler: (req, _res, next) => {
      logger.warn("Rate limit exceeded", {
        path: req.path,
        ip: req.ip,
        endpoint
      });

      next(new ApiError(httpStatus.TOO_MANY_REQUESTS, `Too many ${endpoint} requests`));
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false
  });
};

// Pre-configured rate limiters for common use cases
export const defaultRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  endpoint: "API"
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  endpoint: "Auth"
});

export {
  authLimiter,
};