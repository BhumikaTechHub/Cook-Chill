const prisma = require('../lib/prisma');
const { getTokenFromRequest, verifyAuthToken } = require('../lib/auth');

module.exports = async function optionalAuthenticate(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return next();
    }

    try {
        const payload = verifyAuthToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (user) {
            req.user = user;
        }
    } catch (error) {
        req.user = null;
    }

    return next();
};
