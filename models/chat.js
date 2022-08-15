const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    input: {
        type: String,
        require: true,
    },
    room: {
        type: String,
        require: true,
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Chat', chatSchema);