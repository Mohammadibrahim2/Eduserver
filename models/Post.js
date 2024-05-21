const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
   
    slug: {
        type: String,
    
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
module.exports = postSchema