const express = require('express');

const apiController = require('../controllers/apiController');
const authenticate = require('../middleware/authenticate');
const asyncHandler = require('../middleware/asyncHandler');
const optionalAuthenticate = require('../middleware/optionalAuthenticate');
const validate = require('../middleware/validate');
const {
    changePasswordSchema,
    favoriteSchema,
    profileSchema,
    ratingSchema,
    recipeSchema,
    reviewSchema,
} = require('../validation/schemas');

const router = express.Router();

router.get('/homepage', asyncHandler(apiController.getHomepageData));
router.get('/cook1', asyncHandler(apiController.getCookLandingData));
router.get('/chill1', asyncHandler(apiController.getChillLandingData));

router.get('/recipes', optionalAuthenticate, asyncHandler(apiController.getRecipes));
router.post('/recipes', authenticate, validate(recipeSchema), asyncHandler(apiController.createRecipe));
router.put('/recipes/:id', authenticate, validate(recipeSchema), asyncHandler(apiController.updateRecipe));
router.delete('/recipes/:id', authenticate, asyncHandler(apiController.deleteRecipe));

router.get('/profile', authenticate, asyncHandler(apiController.getProfile));
router.put('/profile', authenticate, validate(profileSchema), asyncHandler(apiController.updateProfile));
router.patch('/profile/password', authenticate, validate(changePasswordSchema), asyncHandler(apiController.changePassword));

router.get('/favorites', authenticate, asyncHandler(apiController.getFavorites));
router.post('/favorites', authenticate, validate(favoriteSchema), asyncHandler(apiController.createFavorite));
router.delete('/favorites/:id', authenticate, asyncHandler(apiController.deleteFavorite));

router.get('/reviews', asyncHandler(apiController.getReviews));
router.post('/reviews', authenticate, validate(reviewSchema), asyncHandler(apiController.createReview));

router.get('/ratings', asyncHandler(apiController.getRatings));
router.post('/ratings', authenticate, validate(ratingSchema), asyncHandler(apiController.upsertRating));

module.exports = router;
