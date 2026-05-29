const express = require('express');

const pageController = require('../controllers/pageController');
const redirectIfAuthenticated = require('../middleware/redirectIfAuthenticated');
const requirePageAuth = require('../middleware/requirePageAuth');

const router = express.Router();

const legacyRedirects = {
    '/homepage.html': '/',
    '/AboutUs.html': '/about',
    '/ContactUs.html': '/contact',
    '/login.html': '/login',
    '/sign-up.html': '/signup',
    '/personal.html': '/profile',
    '/saved.html': '/saved',
    '/review.html': '/review',
    '/cook1.html': '/cook',
    '/cook2.html': '/cook/discover',
    '/cook4.html': '/cook/reviews',
    '/chill1.html': '/chill',
    '/chill2.html': '/chill/discover',
    '/chill3.html': '/chill/reviews',
    '/AboutUs': '/about',
    '/ContactUs': '/contact',
    '/sign-up': '/signup',
    '/personal': '/profile',
};

Object.entries(legacyRedirects).forEach(([legacyPath, currentPath]) => {
    router.get(legacyPath, (req, res) => res.redirect(301, currentPath));
});

router.get('/Cook&Chill/*', (req, res) => {
    const requestedPath = `/${req.params[0]}`;
    res.redirect(301, legacyRedirects[requestedPath] || '/');
});

router.get('/cook/1', (req, res) => res.redirect(301, '/cook'));
router.get('/cook/2', (req, res) => res.redirect(301, '/cook/discover'));
router.get('/cook/4', (req, res) => res.redirect(301, '/cook/reviews'));
router.get('/chill/1', (req, res) => res.redirect(301, '/chill'));
router.get('/chill/2', (req, res) => res.redirect(301, '/chill/discover'));
router.get('/chill/3', (req, res) => res.redirect(301, '/chill/reviews'));

router.get('/', pageController.renderHome);
router.get('/about', pageController.renderAbout);
router.get('/contact', pageController.renderContact);
router.get('/login', redirectIfAuthenticated, pageController.renderLogin);
router.get('/signup', redirectIfAuthenticated, pageController.renderSignup);
router.get('/profile', requirePageAuth, pageController.renderProfile);
router.get('/saved', requirePageAuth, pageController.renderSaved);
router.get('/review', requirePageAuth, pageController.renderReview);

router.get('/cook', pageController.renderCookLanding);
router.get('/cook/discover', pageController.renderCookDiscover);
router.get('/cook/3', (req, res) => res.redirect(301, '/cook'));
// Upload page removed. Redirects to /cook
// router.get('/cook/upload', requirePageAuth, pageController.renderCookUpload);
router.get('/cook/reviews', pageController.renderCookReviews);

router.get('/chill', pageController.renderChillLanding);
router.get('/chill/discover', pageController.renderChillDiscover);
router.get('/chill/reviews', pageController.renderChillReviews);

router.get('/privacy', pageController.renderPrivacy);
router.get('/terms', pageController.renderTerms);

module.exports = router;
