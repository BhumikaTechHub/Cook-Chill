module.exports = function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => issue.message);
            return res.status(400).json({
                message: errors[0] || 'Validation failed.',
                errors,
            });
        }

        req.validatedBody = result.data;
        return next();
    };
};
