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
            choices: Array
        }
    ],
    answer: {
        type: Array,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Quiz', quizSchema);
