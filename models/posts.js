const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model('Post', postSchema);