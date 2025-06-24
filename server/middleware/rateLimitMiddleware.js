import rateLimit from 'express-rate-limit';

export const friendRequestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit to 5 requests/min
  message: 'Too many requests, try again later.',
});
