const Class = require('../models/class');
const Post = require('../models/posts');

module.exports.index = async (req, res) => {
    const classes = await Class.find({});
    res.render('class/index', { classes });
}

module.exports.createRenderForm = (req, res) => {
    res.render('class/new');
}

module.exports.createClass = async (req, res) => {
    const newClass = new Class(req.body);
    await newClass.save();
    res.redirect('/class');
}

module.exports.showClass = async (req, res) => {
    const { id } = req.params;
    const showClass = await Class.findById(id);
    const posts = await Post.find({ class: id }).populate({
        path: 'class',
        populate: {
            path: 'name'
        }
    }).populate('author');
    const classes = await Class.find({});
    res.render('class/show', { showClass, posts, classes });
}

module.exports.joinClass = async (req, res) => {
    const { id } = req.params;
    const currentClass = await Class.findById(id);
    const User = req.user;
    currentClass.students.push(req.user._id);
    await currentClass.save();
    User.classes.push(currentClass._id);
    await User.save()
    res.redirect(`/class/${id}`);
}