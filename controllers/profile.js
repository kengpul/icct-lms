const User = require('../models/user');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('profile/index', { user });
}

module.exports.renderEditForm = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('profile/edit', { user });
}

module.exports.edit = async (req, res) => {
    const editUser = await User.findByIdAndUpdate(req.user._id, req.body);
    await editUser.save();
    res.redirect('/profile');
}