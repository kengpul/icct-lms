const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    chats: [
        {
            type: String
        }
    ]
})

module.exports = mongoose.model('Chat', chatSchema);