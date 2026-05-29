function render(viewName, pageTitle, extraLocals = {}) {
    return (req, res) => {
        res.render(`pages/${viewName}`, {
            title: pageTitle,
            currentPath: req.path,
            ...extraLocals,
        });
    };
}

exports.renderHome = render('home', 'Cook & Chill');
exports.renderAbout = render('about', 'About | Cook & Chill');
exports.renderContact = render('contact', 'Contact | Cook & Chill');
exports.renderLogin = render('login', 'Login | Cook & Chill');
exports.renderSignup = render('signup', 'Sign Up | Cook & Chill');
exports.renderProfile = render('profile', 'My Account | Cook & Chill', { activePage: 'profile' });
exports.renderSaved = render('saved', 'Saved | Cook & Chill', { activePage: 'saved' });
exports.renderReview = render('review', 'Review | Cook & Chill', { activePage: 'review' });

exports.renderPrivacy = render('privacy', 'Privacy Policy | Cook & Chill');
exports.renderTerms = render('terms', 'Terms & Conditions | Cook & Chill');

exports.renderCookLanding = render('cook1', 'Cook | Cook & Chill');
exports.renderCookDiscover = render('cook2', 'Cook Discover | Cook & Chill');
// Upload page removed; renderCookUpload intentionally omitted.
exports.renderCookReviews = render('cook4', 'Cook Reviews | Cook & Chill');

exports.renderChillLanding = render('chill1', 'Chill | Cook & Chill');
exports.renderChillDiscover = render('chill2', 'Chill Discover | Cook & Chill');
exports.renderChillReviews = render('chill3', 'Chill Reviews | Cook & Chill');
