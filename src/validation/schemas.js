const { z } = require('zod');

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
const favoriteTargets = ['RECIPE', 'ENTERTAINMENT'];
const reviewTargets = ['RECIPE', 'ENTERTAINMENT', 'GENERAL'];
const ratingTargets = ['RECIPE', 'ENTERTAINMENT'];

const trimmedString = (message) => z.string().trim().min(1, message);

exports.signupSchema = z.object({
    USERNAME: z.string().trim().min(3, 'Username must be at least 3 characters long.'),
    EMAIL: z.string().trim().email('A valid email address is required.'),
    PASSWORD: z.string().min(6, 'Password must be at least 6 characters long.'),
});

exports.loginSchema = z.object({
    USERNAME: trimmedString('Username is required.'),
    PASSWORD: trimmedString('Password is required.'),
});

exports.recipeSchema = z.object({
    title: trimmedString('Title is required.'),
    description: trimmedString('Description is required.'),
    ingredients: trimmedString('Ingredients are required.'),
    category: z.enum(categories, { errorMap: () => ({ message: 'Category is required.' }) }),
    tags: z.array(z.string().trim().min(1)).min(1, 'At least one tag is required.').max(12, 'Too many tags.').default([]),
});

exports.profileSchema = z.object({
    FULLNAME: z.string().trim().min(2, 'Full name must be at least 2 characters long.').optional().or(z.literal('')).transform((value) => value || null),
    PHONE: z.string().trim().regex(/^\+?[0-9]{10,15}$/, 'Phone must be a valid 10 to 15 digit number.').optional().or(z.literal('')).transform((value) => value || null),
    DATE_OF_BIRTH: z.string().trim().optional().or(z.literal(''))
        .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), {
            message: 'Date of birth must be a valid date.',
        })
        .transform((value) => (value ? new Date(value) : null)),
});

exports.changePasswordSchema = z.object({
    CURRENT_PASSWORD: trimmedString('Current password is required.'),
    NEW_PASSWORD: z.string().min(6, 'New password must be at least 6 characters long.'),
});

exports.favoriteSchema = z.object({
    targetType: z.enum(favoriteTargets, { errorMap: () => ({ message: 'targetType must be RECIPE or ENTERTAINMENT.' }) }).default('RECIPE'),
    targetTitle: trimmedString('targetTitle is required.'),
    targetImage: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    recipeId: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
});

exports.reviewSchema = z.object({
    targetType: z.enum(reviewTargets, { errorMap: () => ({ message: 'targetType must be RECIPE, ENTERTAINMENT, or GENERAL.' }) }).default('GENERAL'),
    targetTitle: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    recipeId: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    comment: trimmedString('comment is required.'),
});

exports.ratingSchema = z.object({
    targetType: z.enum(ratingTargets, { errorMap: () => ({ message: 'targetType must be RECIPE or ENTERTAINMENT.' }) }).default('RECIPE'),
    targetTitle: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    recipeId: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    reviewId: z.string().trim().optional().or(z.literal('')).transform((value) => value || null),
    value: z.coerce.number().int().min(1, 'value must be between 1 and 5.').max(5, 'value must be between 1 and 5.'),
});
