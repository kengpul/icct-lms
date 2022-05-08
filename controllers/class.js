const Class = require('../models/class');
const Post = require('../models/posts');
const User = require('../models/user');

module.exports.index = async (req, res) => {
    const classes = await Class.find({});
    const user = await User.findById(req.user).populate({
        path: 'classes',
        populate: {
            path: 'teacher'
        }
    })
    res.render('class/index', { classes, user });
}

module.exports.createClass = async (req, res) => {
    const _class = await Class.findOne({ code: req.body.code })
    if (_class) {
        req.flash('error', 'Code already in use');
        return res.redirect('/post');
    }
    const newClass = new Class(req.body);
    await newClass.save();
    newClass.teacher = req.user._id;
    newClass.students.push(req.user._id);
    req.user.classes.push(newClass._id);
    await newClass.save();
    await req.user.save();
    res.redirect(`/class/${newClass._id}`);
}

module.exports.showClass = async (req, res) => {
    const { id } = req.params;
    const showClass = await Class.findById(id).populate('pending').populate('teacher');
    const posts = await Post.find({ class: id }).populate({
        path: 'class',
        populate: {
            path: 'name'
        }
    }).populate('author');
    posts.sort(function (a, b) {
        return b.created - a.created;
    })
    const user = await User.findById(req.user._id).populate('classes');
    res.render('class/show', { showClass, posts, user });
}

module.exports.joinClass = async (req, res) => {
    const joinClass = await Class.findOne({ code: req.body.code });
    if (!joinClass) {
        req.flash('error', 'The code you entered is invalid!')
        return res.redirect('/post');
    }
    if (joinClass.pending.includes(req.user._id)) {
        req.flash('success', 'You are already in the pending list');
        return res.redirect('/post');
    }
    if (joinClass.students.includes(req.user._id)) {
        req.flash('success', 'You are already member of this class');
        return res.redirect('/post');
    }
    joinClass.pending.push(req.user._id);
    await joinClass.save();
    req.flash('success', 'Teacher will approve you to join in this group')
    res.redirect('/post');
}

module.exports.acceptStudent = async (req, res) => {
    const { classId, studentId } = req.params;
    const currentClass = await Class.findById(classId);
    const user = await User.findById(studentId);
    currentClass.students.push(user._id);
    user.classes.push(currentClass._id);
    currentClass.pending.splice(currentClass.pending.indexOf(user._id), 1);
    await currentClass.save();
    await user.save();
    req.flash('success', `${user.username} added to the class`);
    res.redirect(`/class/${classId}/members`);
}

module.exports.leaveStudent = async (req, res) => {
    const { classId, studentId } = req.params;
    const currentClass = await Class.findById(classId);
    const user = await User.findById(studentId);
    user.classes.splice(user.classes.indexOf(currentClass._id), 1);
    currentClass.students.splice(currentClass.students.indexOf(user._id), 1);
    await currentClass.save();
    await user.save();
    req.flash('success', `Bye!`);
    res.redirect('/class');
}

module.exports.rejectStudent = async (req, res) => {
    const { classId, studentId } = req.params;
    const currentClass = await Class.findById(classId);
    const user = await User.findById(studentId);
    currentClass.pending.splice(currentClass.pending.indexOf(user._id), 1);
    await currentClass.save();
    req.flash('success', `Rejected ${user.fullName}`);
    res.redirect(`/class/${classId}/members`);
}

module.exports.showMembers = async (req, res) => {
    const showClass = await Class.findById(req.params.id)
        .populate('students')
        .populate('teacher')
        .populate('pending')
    const user = await User.findById(req.user._id).populate('classes');
    res.render('class/members', { showClass, user })
}
