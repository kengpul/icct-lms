const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Student', 'Teacher'],
    },
    firstname: String,
    lastname: String,
    birthday: String,
    number: String,
    course: String,
    campus: {
        type: String,
        enum: [
            'Angono', 'Antipolo', 'Binangonan', 'Cainta Main',
            'Cogeo', 'San Mateo', 'Sumulong', 'Taytay'
        ]
    },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]
})

userSchema.virtual('givenName').get(function () {
    const name = this.firstname || this.username;
    return name;
});

userSchema.virtual('fullName').get(function () {
    if (this.firstname || this.lastname) {
        return `${this.lastname}, ${this.firstname}`;
    }
    return this.username;
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
