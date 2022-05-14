const mongoose = require('mongoose');
const { Schema } = mongoose;
const { cloudinary } = require('../cloudinary');

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

postSchema.virtual('postImage').get(function () {
    const images = this.images.map(img => cloudinary.url(img.filename,
        { width: 550, height: 300 }));
    return images;
})

postSchema.virtual('showPostImage').get(function () {
    const images = this.images.map(img => cloudinary.url(img.filename,
        { width: 550, height: 400 }));
    return images;
})

postSchema.virtual('editPostImage').get(function () {
    const images = this.images.map(img => cloudinary.url(img.filename,
        { width: 200, height: 100 }));
    return images;
})

module.exports = mongoose.model('Post', postSchema);