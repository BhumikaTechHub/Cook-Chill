function serializeUser(user) {
    if (!user) {
        return null;
    }

    return {
        _id: user.id,
        USERNAME: user.username,
        EMAIL: user.email,
        FULLNAME: user.fullName,
        PHONE: user.phone,
        DATE_OF_BIRTH: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

function serializeRecipe(recipe) {
    if (!recipe) {
        return null;
    }

    return {
        _id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        category: recipe.category,
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        authorId: recipe.authorId || null,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
        reviews: Array.isArray(recipe.reviews) ? recipe.reviews.map(serializeReview) : undefined,
        favorites: Array.isArray(recipe.favorites) ? recipe.favorites.map(serializeFavorite) : undefined,
        ratings: Array.isArray(recipe.ratings) ? recipe.ratings.map(serializeRating) : undefined,
    };
}

function serializeReview(review) {
    if (!review) {
        return null;
    }

    return {
        _id: review.id,
        comment: review.comment,
        targetType: review.targetType,
        targetTitle: review.targetTitle,
        recipeId: review.recipeId,
        userId: review.userId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    };
}

function serializeFavorite(favorite) {
    if (!favorite) {
        return null;
    }

    return {
        _id: favorite.id,
        targetType: favorite.targetType,
        targetTitle: favorite.targetTitle,
        targetImage: favorite.targetImage,
        recipeId: favorite.recipeId,
        userId: favorite.userId,
        createdAt: favorite.createdAt,
    };
}

function serializeRating(rating) {
    if (!rating) {
        return null;
    }

    return {
        _id: rating.id,
        targetType: rating.targetType,
        targetTitle: rating.targetTitle,
        recipeId: rating.recipeId,
        reviewId: rating.reviewId,
        userId: rating.userId,
        value: rating.value,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
    };
}

module.exports = {
    serializeUser,
    serializeRecipe,
    serializeReview,
    serializeFavorite,
    serializeRating,
};
