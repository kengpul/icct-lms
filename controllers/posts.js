const Post = require('../models/posts');
const User = require('../models/user');
const Classes = require('../models/class');

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id).populate('classes').populate('groups');
    const classPosts = await Post.find({ class: { $in: req.user.classes } }).populate('class').populate('author');
    const groupPosts = await Post.find({ group: { $in: req.user.groups } }).populate('group').populate('author');
    const classes = await Classes.find({});
    res.render('posts/index', { classPosts, groupPosts, user, classes });
}

module.exports.createPost = async (req, res) => {
    try {
        const { text, postTo } = req.body;
        const _class = await Classes.findById(postTo);
        let post;
        if (!_class) {
            post = new Post({ text, group: postTo });
        } else {
            post = new Post({ text, class: postTo });
        }
        post.author = req.user._id;
        await post.save();
    } catch (e) {
        //We are not supposed to reach here but just in case
        console.log('something went wrong', e)
    }
    req.flash('success', 'Successfully Created a Post');
    res.redirect(`/post`);
}

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'class',
        populate: {
            path: 'name'
        }
    }).populate('author').populate({
        path: 'group',
        populate: {
            path: 'name'
        }
    }).populate('author');
    res.render('posts/show', { post })
}

module.exports.renderEditPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
}

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    await post.save();
    req.flash('success', 'Successfully updated your post!');
    res.redirect(`/post/${id}`);
}

module.exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a post!');
    res.redirect('/post');
}