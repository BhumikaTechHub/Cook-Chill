const bcrypt = require('bcryptjs');

const prisma = require('../lib/prisma');
const { getAuthCookieOptions, TOKEN_COOKIE_NAME, signAuthToken } = require('../lib/auth');
const { serializeUser } = require('../utils/serializers');

exports.signUp = async (req, res) => {
    const data = req.validatedBody;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: data.username },
                { email: data.email },
            ],
        },
    });

    if (existingUser) {
        return res.status(409).json({ message: 'Username or email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: hashedPassword,
        },
    });

    res.status(201).json({
        message: 'User signed up successfully.',
        redirectTo: '/login',
        user: serializeUser(user),
    });
};

exports.logIn = async (req, res) => {
    const data = req.validatedBody;

    const user = await prisma.user.findUnique({
        where: { username: data.username },
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = signAuthToken(user);
    res.cookie(TOKEN_COOKIE_NAME, token, getAuthCookieOptions());

    res.json({
        message: 'Login successful.',
        token,
        redirectTo: '/profile',
        user: serializeUser(user),
    });
};

exports.logOut = async (req, res) => {
    res.clearCookie(TOKEN_COOKIE_NAME, {
        ...getAuthCookieOptions(),
        maxAge: undefined,
    });

    res.json({
        message: 'Logged out successfully.',
        redirectTo: '/login',
    });
};
