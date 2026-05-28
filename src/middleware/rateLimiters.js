const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === 'production' ? 10 : 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many authentication attempts. Please try again later.',
    },
});

exports.apiWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === 'production' ? 120 : 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many write requests. Please slow down and try again.',
    },
});
