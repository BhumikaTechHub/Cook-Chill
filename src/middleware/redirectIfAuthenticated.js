const prisma = require('../lib/prisma');
const { getTokenFromRequest, verifyAuthToken } = require('../lib/auth');

module.exports = async function redirectIfAuthenticated(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return next();
    }

    try {
        const payload = verifyAuthToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true },
        });

        if (user) {
            return res.redirect('/profile');
        }
    } catch (error) {
        return next();
    }

    return next();
};
