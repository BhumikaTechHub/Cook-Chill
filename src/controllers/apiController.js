const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = require('../lib/prisma');
const {
    serializeFavorite,
    serializeRating,
    serializeRecipe,
    serializeReview,
    serializeUser,
} = require('../utils/serializers');

const dataDirectory = path.join(__dirname, '../../public/JSON');

async function readJsonFile(fileName) {
    const filePath = path.join(dataDirectory, fileName);
    const rawData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(rawData);
}

function normalizeCookLandingData(data) {
    return {
        ...data,
        sections: Array.isArray(data.sections)
            ? data.sections.map((section) => ({
                ...section,
                fontSize: section.fontSize || section.fontsize || '50px',
            }))
            : [],
    };
}

exports.getHomepageData = async (req, res) => {
    const data = await readJsonFile('homepage.json');
    res.json(data);
};

exports.getCookLandingData = async (req, res) => {
    const data = await readJsonFile('cook1.json');
    res.json(normalizeCookLandingData(data));
};

exports.getChillLandingData = async (req, res) => {
    const data = await readJsonFile('chill1.json');
    res.json(data);
};

exports.getRecipes = async (req, res) => {
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const sort = String(req.query.sort || 'newest').trim();
    const where = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { tags: { has: search } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (category) {
        where.category = category;
    }

    if (req.query.mine === 'true') {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        where.authorId = req.user.id;
    }

    const orderBy = sort === 'oldest'
        ? { createdAt: 'asc' }
        : { createdAt: 'desc' };

    const recipes = await prisma.recipe.findMany({
        where,
        orderBy,
        include: {
            reviews: true,
            favorites: true,
            ratings: true,
        },
    });

    res.json(recipes.map(serializeRecipe));
};

exports.createRecipe = async (req, res) => {
    const data = req.validatedBody;

    const recipe = await prisma.recipe.create({
        data: {
            ...data,
            authorId: req.user.id,
        },
    });

    res.status(201).json({
        message: 'Recipe saved successfully.',
        recipe: serializeRecipe(recipe),
    });
};

exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const data = req.validatedBody;

    const recipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found.' });
    }

    if (recipe.authorId && recipe.authorId !== req.user.id) {
        return res.status(403).json({ message: 'You are not allowed to edit this recipe.' });
    }

    const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data,
    });

    res.json({
        message: 'Recipe updated successfully.',
        recipe: serializeRecipe(updatedRecipe),
    });
};

exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found.' });
    }

    if (recipe.authorId && recipe.authorId !== req.user.id) {
        return res.status(403).json({ message: 'You are not allowed to delete this recipe.' });
    }

    await prisma.recipe.delete({
        where: { id },
    });

    res.json({ message: 'Recipe deleted successfully.' });
};

exports.getProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
            recipes: {
                orderBy: { createdAt: 'desc' },
            },
            favorites: {
                orderBy: { createdAt: 'desc' },
            },
            reviews: {
                orderBy: { createdAt: 'desc' },
            },
            ratings: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    res.json({
        message: 'Profile fetched successfully.',
        profile: {
            ...serializeUser(user),
            recipes: user.recipes.map(serializeRecipe),
            favorites: user.favorites.map(serializeFavorite),
            reviews: user.reviews.map(serializeReview),
            ratings: user.ratings.map(serializeRating),
        },
    });
};

exports.updateProfile = async (req, res) => {
    const data = req.validatedBody;

    // Normalize incoming field names (validation schema uses uppercase keys)
    const { FULLNAME, PHONE, DATE_OF_BIRTH } = data;

    const updateData = {};
    if (typeof FULLNAME !== 'undefined') updateData.fullName = FULLNAME;
    if (typeof PHONE !== 'undefined') updateData.phone = PHONE;
    if (typeof DATE_OF_BIRTH !== 'undefined') updateData.dateOfBirth = DATE_OF_BIRTH;

    const user = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
    });

    res.json({
        message: 'Profile updated successfully.',
        profile: serializeUser(user),
    });
};

exports.changePassword = async (req, res) => {
    const { CURRENT_PASSWORD, NEW_PASSWORD } = req.validatedBody;

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(CURRENT_PASSWORD, user.passwordHash);
    if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

    await prisma.user.update({
        where: { id: req.user.id },
        data: { passwordHash },
    });

    res.json({
        message: 'Password updated successfully.',
    });
};

exports.getFavorites = async (req, res) => {
    const favorites = await prisma.favorite.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        message: 'Favorites fetched successfully.',
        favorites: favorites.map(serializeFavorite),
    });
};

exports.createFavorite = async (req, res) => {
    const data = req.validatedBody;

    const existingFavorite = await prisma.favorite.findFirst({
        where: {
            userId: req.user.id,
            OR: [
                data.recipeId ? { recipeId: data.recipeId } : undefined,
                {
                    targetType: data.targetType,
                    targetTitle: data.targetTitle,
                },
            ].filter(Boolean),
        },
    });

    if (existingFavorite) {
        return res.status(409).json({ message: 'This item is already saved in favorites.' });
    }

    const favorite = await prisma.favorite.create({
        data: {
            ...data,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        message: 'Favorite saved successfully.',
        favorite: serializeFavorite(favorite),
    });
};

exports.deleteFavorite = async (req, res) => {
    const { id } = req.params;

    const favorite = await prisma.favorite.findFirst({
        where: {
            id,
            userId: req.user.id,
        },
    });

    if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found.' });
    }

    await prisma.favorite.delete({
        where: { id },
    });

    res.json({ message: 'Favorite deleted successfully.' });
};

exports.getReviews = async (req, res) => {
    const where = {};

    if (req.query.recipeId) {
        where.recipeId = String(req.query.recipeId);
    }

    if (req.query.targetType) {
        where.targetType = String(req.query.targetType).toUpperCase();
    }

    const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        message: 'Reviews fetched successfully.',
        reviews: reviews.map(serializeReview),
    });
};

exports.createReview = async (req, res) => {
    const data = req.validatedBody;

    const review = await prisma.review.create({
        data: {
            ...data,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        message: 'Review created successfully.',
        review: serializeReview(review),
    });
};

exports.getRatings = async (req, res) => {
    const where = {};

    if (req.query.recipeId) {
        where.recipeId = String(req.query.recipeId);
    }

    if (req.query.reviewId) {
        where.reviewId = String(req.query.reviewId);
    }

    if (req.query.targetType) {
        where.targetType = String(req.query.targetType).toUpperCase();
    }

    const ratings = await prisma.rating.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        message: 'Ratings fetched successfully.',
        ratings: ratings.map(serializeRating),
    });
};

exports.upsertRating = async (req, res) => {
    const data = req.validatedBody;

    const existingRating = await prisma.rating.findFirst({
        where: {
            userId: req.user.id,
            recipeId: data.recipeId,
            reviewId: data.reviewId,
            targetType: data.targetType,
            targetTitle: data.targetTitle,
        },
    });

    const rating = existingRating
        ? await prisma.rating.update({
            where: { id: existingRating.id },
            data: {
                value: data.value,
                targetTitle: data.targetTitle,
            },
        })
        : await prisma.rating.create({
            data: {
                ...data,
                userId: req.user.id,
            },
        });

    res.status(existingRating ? 200 : 201).json({
        message: existingRating ? 'Rating updated successfully.' : 'Rating created successfully.',
        rating: serializeRating(rating),
    });
};
