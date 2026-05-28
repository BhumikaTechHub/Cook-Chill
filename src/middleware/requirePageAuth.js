const prisma = require('../lib/prisma');
const { getTokenFromRequest, verifyAuthToken } = require('../lib/auth');

module.exports = async function requirePageAuth(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }

    try {
        const payload = verifyAuthToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                username: true,
            },
        });

        if (!user) {
            return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
        }

        req.user = user;
        res.locals.currentUser = user;
        return next();
    } catch (error) {
        return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }
};
