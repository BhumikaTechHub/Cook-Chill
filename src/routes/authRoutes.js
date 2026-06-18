const express = require('express');

const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');
const { authLimiter } = require('../middleware/rateLimiters');
const validate = require('../middleware/validate');
const { loginSchema, signupSchema } = require('../validation/schemas');

const router = express.Router();

router.post('/signup',  validate(signupSchema), asyncHandler(authController.signUp));
router.post('/login', validate(loginSchema), asyncHandler(authController.logIn));
router.post('/logout', asyncHandler(authController.logOut));

module.exports = router;
