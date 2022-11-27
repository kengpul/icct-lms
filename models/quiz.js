const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
    title: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    quiz: [
        {
            question: String,
            choices: [String]
        }
    ],
    answer: {
        type: Array,
        required: true
    },
    assignedTo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    groupId: String,
    dueDate: Date
}, { timestamps: true })

module.exports = mongoose.model('Quiz', quizSchema);
