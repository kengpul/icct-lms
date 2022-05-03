const Group = require('../models/group');
const Post = require('../models/posts');
const User = require('../models/user');

module.exports.index = async (req, res) => {
    const groups = await Group.find({});
    const user = await User.findById(req.user).populate({
        path: 'groups',
        populate: {
            path: 'teacher'
        }
    })
    res.render('group/index', { groups, user });
}

module.exports.createGroup = async (req, res) => {
    const newGroup = new Group(req.body);
    await newGroup.save();
    newGroup.students.push(req.user._id);
    newGroup.teacher = req.user._id;
    req.user.groups.push(newGroup._id);
    await newGroup.save();
    await req.user.save();
    res.redirect(`/group/${newGroup._id}`);
}

module.exports.showGroup = async (req, res) => {
    const { id } = req.params;
    const showGroup = await Group.findById(id).populate('pending').populate('teacher');
    const posts = await Post.find({ group: id }).populate({
        path: 'group',
        populate: {
            path: 'name'
        }
    }).populate('author');
    posts.sort(function (a, b) {
        return b.created - a.created;
    })
    const user = await User.findById(req.user._id).populate('groups');
    res.render('group/show', { showGroup, posts, user });
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