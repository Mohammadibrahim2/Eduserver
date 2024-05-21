const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true

    },
    slug: {
        type: String,

    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true

    },

    review: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },



})
module.exports = reviewsSchema