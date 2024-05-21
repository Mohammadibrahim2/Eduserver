const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    slug: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: "CourseCategory",
        required: true
    },

    tittle: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true

    },

    description: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String

    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },



})
module.exports = courseSchema