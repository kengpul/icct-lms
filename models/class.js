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
    ]
})

module.exports = mongoose.model('Class', classSchema);