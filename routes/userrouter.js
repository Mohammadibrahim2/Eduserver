const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const userSchema = require("../Server/models/User.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const checklogin = require("../Server/helpers/authjwt.js");
const formidableMiddleware = require('express-formidable');
const fs = require("fs");
const { default: slugify } = require("slugify");
const User = new mongoose.model("User", userSchema);

//create product into db:-
router.post("/register", formidableMiddleware(), async (req, res) => {
 
    const { name, email, passwordHash, isAdmin, phone,role} = req.fields;
    
    const { photo } = req.files;
    switch (true) {
        case !name:
            return req.status(500).send({ error: "name is requried" });
        case !email:
            return req.status(500).send({ error: "email is requried" });
        case !passwordHash:
            return req.status(500).send({ error: "password is requried" });
        case !isAdmin:
            return req.status(500).send({ error: "isAdmin is requried" });
        case !phone:
            return req.status(500).send({ error: "phone is requried" });
        case !role:
            return req.status(500).send({ error: "role is requried" });
           
        case photo && photo.size > 1000000:
            return req.status(500).send({ error: "photo is requried and should be lezz than 1mb" });

    }
   
    const user=new User({...req.fields,slug:slugify(name)})
    if(photo){
        user.photo.data=fs.readFileSync(photo.path)
        user.photo.contentType=photo.type
    }

    
    let newUser = new User({
        name:name,
        email: email,
     
        isAdmin: isAdmin,
        role:role,
        phone:phone,
        photo:user.photo,
        slug:slugify(name),
        passwordHash: bcrypt.hashSync(passwordHash, 10),

    })

   const createdUser= await newUser.save()
   
    res.status(201).send({
        success:true,
        message:"successfully create an user",
        createdUser,
    })
      
       if(!createdUser)
        return res.status(400).send("the user can not be created")

 
    

});


//get data from db :-Api is okay

router.get("/get-user",async (req, res) => {
    const user = await User.find().select("-photo -passwordHash").sort("-createdAt")
    res.status(201).send({
        totalUsers:user.length,
        user:user,
        success:true,
        message:"All the users"
    })
   
 
});

//single user from db by key:- Api is okay
router.get("/get-single-user/:id", async (req, res) => {
    const user = await User.find(
        { _id: req.params.id }
    ).select('-photo')

    
    res.status(201).send(user)

});
router.get("/get-teachers/:key", async (req, res) => {
    const user = await User.find(
        { role: req.params.key }
    ).select('-photo')

    
    res.status(201).send({
        success:true,
        teachers:user,
        message:"all teachers"
    })

});
//getting photo:- Api is okay
router.get("/user-photo/:id",async(req,res)=>{
    try{
      
const user= await User.findById(req.params.id).select('photo')

if(user.photo.data){
    res.set('Content-Type',user.photo.contentType)
    return res.status(201).send(user.photo.data)
}
    }
    catch (error){
res.send({
    message:"photo nai",
    error:error
})
    }
})
//update data into db :
router.put("/update-user/:id", async (req, res) => {

    const user = await User.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name

            }
        },
        {
            useFindAndModidy: false
        }

    )


   
    res.status(201).send(user)

});

//delete data from db :-  Api is okay.
router.delete("/delete-user/:id", async (req, res) => {
    const user = await User.deleteOne({ _id: req.params.id }

    )
   
    res.status(201).send({
        message:"successfully deleted the user",
        user,
       
        success:true
    })

});
//for login user:-In complete
router.post('/login',async(req,res)=>{
    const user= await User.findOne({email:req.body.email}).select("-photo")
   
    const secret="my-village-is-best"
    if(!user){
        return res.status(400).send("the user is not found")
    }
   
    if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
        const token=jwt.sign(
            {
                userId:user.id,
                userEmail:user.email,
                isAdmin:user.isAdmin
                
            },
            secret,
            {expiresIn:'1h'}
        )
        return res.status(200).send({
            message:"successfully log in",
            success:true,
            user:user,
            token:token})
    }
    else{
        res.status(400).send("user is not authenticated")
    }
   

})
module.exports = router;