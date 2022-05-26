const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pending: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    pin: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})

module.exports = mongoose.model('Class', classSchema);
