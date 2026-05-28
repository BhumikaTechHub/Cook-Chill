const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const { apiWriteLimiter } = require('./middleware/rateLimiters');
const requestLogger = require('./middleware/requestLogger');
const pageRoutes = require('./routes/pageRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const configuredOrigins = [process.env.APP_URL, process.env.CORS_ORIGIN]
    .filter(Boolean)
    .join(',');

const allowedOrigins = configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(requestLogger);
app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS origin not allowed.'));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/api', apiWriteLimiter);
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
