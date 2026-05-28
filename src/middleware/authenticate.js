const prisma = require('../lib/prisma');
const { getTokenFromRequest, verifyAuthToken } = require('../lib/auth');

module.exports = async function authenticate(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const payload = verifyAuthToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired authentication token.' });
    }
};
