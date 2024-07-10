
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/products');
    }
    next();
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && res.locals.currentUser.admin === 1) {
        next();
    } else {
        req.flash('error', '관리자로 로그인하십니오.');
        res.redirect('back');
    }
}

module.exports = {
    checkAdmin,
    checkAuthenticated,
    checkNotAuthenticated
}


// if (req.path.split('/')[1] !== 'admin' ) {
//     return res.sendStatus(404);
// }

// if(req.path.split('/')[2] !== 'products' && req.path.split('/')[2] !== 'categories'){
//     return res.sendStatus(404);
// }