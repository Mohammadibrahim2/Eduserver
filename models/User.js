const mongoose = require('mongoose');

const userSchema= mongoose.Schema({
    name:{
        type:String,
        requried:true
        
    },
    slug:{
        type:String,
        requried:true
    },
    email:{
        type:String,
        required:true
      
    },
   passwordHash:{
        type:String,
        required:true
    },
    isAdmin:{
        type:String,
        default:false
    },
    role:{
        type:String,
        required:true
    },
  
    createdAt:{
        type: Date, 
        required: true, 
        default: Date.now
    },
    photo:{
        data:Buffer,
        contentType:String
        

    },
    phone:{
type:Number,
required:true
    }
   
   
})
module.exports=userSchema