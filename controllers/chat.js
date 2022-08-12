const User = require('../models/user');
const Class = require('../models/class');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user.id).populate('classes');
    const groupChats = user.classes.map(_class => ({ name: _class.name, id: _class.id }));
    res.render('chat/index', { groupChats });
}

module.exports.groupChat = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const _class = await Class.findById(id); // use this to store messages
    res.render('chat/group-chat', { id, user });
}

module.exports.sockets = (io) => {
    io.on('connection', socket => {
        socket.on('joinChat', room => {
            socket.join(room);
        })
        socket.on('chat', (chat, room, id) => {
            io.to(room).emit('displayChat', chat, id)
        })
    })
}