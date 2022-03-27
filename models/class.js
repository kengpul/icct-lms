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
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

    // posts
})

module.exports = mongoose.model('Class', classSchema);