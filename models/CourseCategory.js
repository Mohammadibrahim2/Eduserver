const mongoose = require('mongoose');

const courseCategorySchema= mongoose.Schema({
    name:{
        type:String,
        requried:true
        
    },
    slug:{
        type:String,
        requried:true
    },

    createdAt:{
        type: Date, 
        required: true, 
        default: Date.now
    },

})
module.exports=courseCategorySchema