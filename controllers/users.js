const User = require('../models/user');

module.exports.connect = (req, res) => {
    res.render('users/connect');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/post');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, type, password } = req.body;
        const user = new User({ username, email, type });
        await User.register(user, password);
        req.flash('success', `Welcome ${username}, You may now login your account`);
        return res.redirect('/connect');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/connect');
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Bye!");
    res.redirect('/');
}