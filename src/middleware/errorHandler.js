exports.notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

exports.errorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong.';
    const acceptsHeader = req.headers.accept || '';

    if (error.code === 'P2002') {
        statusCode = 409;
        message = 'A record with this value already exists.';
    }

    if (error.code === 'P2025') {
        statusCode = 404;
        message = 'The requested record could not be found.';
    }

    if (error.code === 'P2003') {
        statusCode = 400;
        message = 'The request references a related record that does not exist.';
    }

    if (req.originalUrl.startsWith('/api') || acceptsHeader.includes('application/json')) {
        return res.status(statusCode).json({ message });
    }

    res.status(statusCode).render('pages/error', {
        title: statusCode === 404 ? 'Page Not Found' : 'Server Error',
        statusCode,
        message,
    });
};
