const Group = require('../models/group');
const Post = require('../models/posts');
const User = require('../models/user');
const {formatDistanceToNow} = require('date-fns');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user).populate({
        path: 'groups',
        populate: {
            path: 'teacher'
        }
    });
    const groups = user.groups;
    if (req.query.search) {
        const searchGroups = user.groups;
        const query = req.query.search.toLowerCase();
        const groups = searchGroups.filter(c => c.name.toLowerCase().includes(query));
        return res.render('group/index', { groups });
    }
    res.render('group/index', { groups });
}

module.exports.createGroup = async (req, res) => {
    const group = await Group.findOne({ code: req.body.code })
    if (group) {
        req.flash('error', 'Code already in use');
        return res.redirect('/post');
    }
    const newGroup = new Group(req.body);
    await newGroup.save();
    newGroup.students.push(req.user._id);
    newGroup.teacher = req.user._id;
    newGroup.chat.name = newGroup.name;
    newGroup.chat.id = newGroup._id;
    req.user.groups.push(newGroup._id);
    await newGroup.save();
    await req.user.save();
    res.redirect(`/group/${newGroup._id}`);
}

module.exports.showGroup = async (req, res) => {
    const { id } = req.params;
    const showGroup = await Group.findById(id)
        .populate('pending')
        .populate('teacher')
        .populate({
            path: 'pin',
            populate: {
                path: 'author'
            }
        })
    const posts = await Post.find({ group: id }).populate({
        path: 'group',
        populate: {
            path: 'name'
        }
    }).populate('author');
    posts.sort(function (a, b) {
        return b.created - a.created;
    })
    const groupPosts = posts.filter(post => !post.equals(showGroup.pin));
    const user = await User.findById(req.user._id).populate('groups').populate({path: 'done', populate: {path: 'quizId'}});

    const isDone = (quizId) => {
        for (let done of user.done) {
            if (done.quizId._id == quizId) {
                return `${done.score}/${done.quizId.quiz.length}`;
            }
        }
        return false;
       }

    res.render('group/show',
    { 
        showGroup,
        groupPosts,
        user,
        formatDistanceToNow,
        isDone
     });
}

module.exports.joinGroup = async (req, res) => {
    const joinGroup = await Group.findOne({ code: req.body.code });
    if (!joinGroup) {
        req.flash('error', 'The code you entered is invalid!')
        return res.redirect('/post');
    }
    if (joinGroup.pending.includes(req.user._id)) {
        req.flash('success', 'You are already in the pending list');
        return res.redirect('/post');
    }
    if (joinGroup.students.includes(req.user._id)) {
        req.flash('success', 'You are already member of this group');
        return res.redirect('/post');
    }
    joinGroup.pending.push(req.user._id);
    await joinGroup.save();
    req.flash('success', 'Teacher will approve you to join in this group')
    res.redirect('/post');
}

module.exports.acceptStudent = async (req, res) => {
    const { groupId, studentId } = req.params;
    const currentGroup = await Group.findById(groupId);
    const user = await User.findById(studentId);
    currentGroup.students.push(user._id);
    user.groups.push(currentGroup._id);
    currentGroup.pending.splice(currentGroup.pending.indexOf(user._id), 1);
    await currentGroup.save();
    await user.save();
    req.flash('success', `${user.username} added to the group`);
    res.redirect(`/group/${groupId}/members`);
}

module.exports.leaveStudent = async (req, res) => {
    const { groupId, studentId } = req.params;
    const currentGroup = await Group.findById(groupId);
    const user = await User.findById(studentId);
    user.groups.splice(user.groups.indexOf(currentGroup._id), 1);
    currentGroup.students.splice(currentGroup.students.indexOf(user._id), 1);
    await currentGroup.save();
    await user.save();
    req.flash('success', `Bye!`);
    res.redirect('/group');
}


module.exports.rejectStudent = async (req, res) => {
    const { groupId, studentId } = req.params;
    const currentGroup = await Group.findById(groupId);
    const user = await User.findById(studentId);
    currentGroup.pending.splice(currentGroup.pending.indexOf(user._id), 1);
    await currentGroup.save();
    req.flash('success', `Rejected ${user.fullName}`);
    res.redirect(`/group/${groupId}/members`);
}

module.exports.showMembers = async (req, res) => {
    const showGroup = await Group.findById(req.params.id)
        .populate('students')
        .populate('teacher')
        .populate('pending')
    const user = await User.findById(req.user._id).populate('groups');
    res.render('group/members', { showGroup, user })
}

module.exports.showQuizes = async (req, res) => {
    const showGroup = await Group.findById(req.params.id)
        .populate({path: 'students',
            populate: {
                path: 'done',
                populate: {
                    path: 'quizId'
                },
            }
    }).populate('teacher');
    const user = await User.findById(req.user._id)
        .populate('quizes')
        .populate({
            path: 'done',
            populate:{
                path: 'quizId',
            }
        });

    const doneQuiz = [];
    for (let quiz of showGroup.students) {
        doneQuiz.push(quiz);
    }
    res.render('group/quizes', { showGroup, user, doneQuiz})
}

module.exports.pin = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const group = await Group.findById(post.group);
    group.pin = post._id;
    await group.save();
    res.redirect(`/group/${group._id}`);
}

module.exports.unPin = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const group = await Group.findById(post.group);
    group.pin = null;
    await group.save();
    res.redirect(`/group/${group._id}`);
}

module.exports.renderEditLinks = async (req, res) => {
    const group = await Group.findById(req.params.id);
    res.render('group/edit', { group });
}

module.exports.editLinks = async (req, res) => {
    const { attendance, video } = req.body;
    const group = await Group.findById(req.params.id);
    group.link.attendance = attendance
    group.link.video = video
    await group.save();
    req.flash('success', 'Successfully update links');
    res.redirect(`/group/${group._id}`);
}
