const User = require('../models/user');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user.id).populate('classes');
    const groupChats = user.classes.map(_class => _class.name);
    console.log(groupChats);
    res.render('chat/index', { groupChats });
}

module.exports.groupChat = (req, res) => {
    const { id } = req.params;
    res.render('chat/group-chat', { id });
}