const prisma = require('../lib/prisma');

async function connectDatabase() {
    await prisma.$connect();
    console.log('PostgreSQL is connected');
}

module.exports = connectDatabase;
