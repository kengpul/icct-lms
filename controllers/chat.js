const User = require('../models/user');
const Class = require('../models/class');
const { formatDistanceToNow } = require('date-fns');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user.id).populate({
        path: 'classes',
        populate: {
            path: 'teacher'
        }
    });
    const groupChats = user.classes.map(_class => ({ name: _class.name, id: _class.id, teacher: _class.teacher.username }));
    res.render('chat/index', { groupChats });
}

module.exports.groupChat = async (req, res) => {
    const { id } = req.params;
    const _class = await Class.findById(id).populate('teacher'); // use this to store messages
    res.render('chat/group-chat', { _class });
}

module.exports.sockets = (io) => {
    io.on('connection', socket => {
        socket.on('joinChat', room => {
            socket.join(room);
        })
        socket.on('chat', chat => {
            io.to(chat.room).emit('displayChat', ({
                ...chat,
                time: formatDistanceToNow(Date.parse(chat.time))
            }))
        })
    })
}