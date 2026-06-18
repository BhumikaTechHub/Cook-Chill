
require('dotenv').config();
 
const express = require("express");
const { PrismaClient } = require("@prisma/client");
 

const app = require('./src/app');
const connectDatabase = require('./src/config/db');
const prisma = require('./src/lib/prisma');

const PORT = process.env.PORT || 4000;
const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

async function startServer() {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on ${appUrl}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

async function shutdown(signal) {
    try {
        await prisma.$disconnect();
        console.log(`Prisma disconnected after ${signal}`);
    } finally {
        process.exit(0);
    }
}

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});
