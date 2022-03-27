const Post = require('../models/posts');
const User = require('../models/user');
const Classes = require('../models/class');

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).populate('class').populate('author');
    const user = await User.findById(req.user._id);
    const classes = await Classes.find({});
    res.render('posts/index', { posts, user, classes });
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully Created a Post');
    res.redirect(`/class/${post.class}`);
}

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'class',
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