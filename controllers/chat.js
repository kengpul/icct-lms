const User = require('../models/user');
const Chat = require('../models/chat');
const Class = require('../models/class');
const Group = require('../models/group');
const { formatDistanceToNow } = require('date-fns');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'classes',
            populate: {
                path: 'teacher'
            }
        })
        .populate({
            path: 'groups',
            populate: {
                path: 'teacher'
            }
        });
    const classChats = user.classes.map(_class => ({
        name: _class.name,
        id: _class.id,
        teacher: _class.teacher.username
    }));
    const _groupChats = user.groups.map(group => ({
        name: group.name,
        id: group.id,
        teacher: group.teacher.username
    }));
    const groupChats = [...classChats, ..._groupChats];
    res.render('chat/index', { groupChats });
}

module.exports.groupChat = async (req, res, next) => {
    const { id } = req.params;
    let room;
    try {
        room = await Class.findById(id)
            .populate('teacher')
            .populate('students');
        if (!room) {
            room = await Group.findById(id)
                .populate('teacher')
                .populate('students');
        }
    } catch (e) {
        if (!e.messageFormat) {
            req.flash('error', 'Cannot find That room!')
            return res.redirect('/chat')
        }
    }

    const chats = await Chat.find({ room: id });
    res.render('chat/group-chat', { room, chats, formatDistanceToNow });
}

module.exports.sockets = (io) => {
    io.on('connection', socket => {
        socket.on('joinChat', room => {
            socket.join(room);
        })
        socket.on('chat', async (chat) => {
            const saveChat = new Chat(chat);
            saveChat.save();
            io.to(chat.room).emit('displayChat', ({
                ...chat,
                time: formatDistanceToNow(Date.parse(chat.time), { addSuffix: true })
            }))
        })
    })
}