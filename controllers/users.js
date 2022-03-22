const User = require('../models/user');

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/post');
}

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    console.log(req.body)
    try {
        const { username, email, type, password } = req.body;
        const user = new User({ username, email, type });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${username}`);
            res.redirect('/post');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Bye!");
    res.redirect('/');
}