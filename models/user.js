const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const { cloudinary } = require('../cloudinary');

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
    image: {
        url: String,
        filename: String
    },
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
    ],
    quizes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    ],
    done: [
        {
            quizId:{
                type: Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            groupId: {
                type: Schema.Types.ObjectId,
                ref: 'Group'
            },
            score: {
                type: Number,
                default: 0,
            }
        }
    ]
})

userSchema.virtual('givenName').get(function () {
    const name = this.firstname || this.username;
    return name;
});

userSchema.virtual('fullName').get(function () {
    if (this.firstname || this.lastname) {
        return `${this.firstname} ${this.lastname}`;
    }
    return this.username;
})

userSchema.virtual('profilePicture').get(function () {
    if (!this.image.url) {
        return `/images/user-image.png`;
    }
    return cloudinary.url(this.image.filename,
        { width: 80, height: 80, gravity: "faces", crop: "thumb" });
})

userSchema.virtual('profilePostIcon').get(function () {
    if (!this.image.url) {
        return `/images/user-image.png`;
    }
    return cloudinary.url(this.image.filename,
        { width: 50, height: 50, gravity: "faces", crop: "thumb" })
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
