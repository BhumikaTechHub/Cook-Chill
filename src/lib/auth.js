const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = 'cookAndChillToken';

function getJwtSecret() {
    return process.env.JWT_SECRET || 'development-secret';
}

function signAuthToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            username: user.username,
        },
        getJwtSecret(),
        { expiresIn: '1h' }
    );
}

function verifyAuthToken(token) {
    return jwt.verify(token, getJwtSecret());
}

function getTokenFromRequest(req) {
    const authorizationHeader = req.headers.authorization || '';
    const [scheme, bearerToken] = authorizationHeader.split(' ');

    if (scheme === 'Bearer' && bearerToken) {
        return bearerToken;
    }

    return req.cookies?.[TOKEN_COOKIE_NAME] || null;
}

function getAuthCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 60 * 60 * 1000,
        path: '/',
    };
}

module.exports = {
    TOKEN_COOKIE_NAME,
    getTokenFromRequest,
    getAuthCookieOptions,
    signAuthToken,
    verifyAuthToken,
};
