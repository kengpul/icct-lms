const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
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
    pin: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    link: {
        attendance: {
            type: String,
            default: null
        },
        video: {
            type: String,
            default: null
        }
    },
    pending: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    quizes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            groupId: String
        }
    ],
    chat: {
        name: String,
        id: String,
    }
})

module.exports = mongoose.model('Group', groupSchema);
