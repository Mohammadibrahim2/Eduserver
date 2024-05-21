const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const reviewsSchema = require("../Server/models/Reviews.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const checklogin = require("../Server/helpers/authjwt.js");
const { default: slugify } = require("slugify");
const Reviews = new mongoose.model("Reviews", reviewsSchema);

//create product into db:-
router.post("/create-reviews",async (req, res) => {
    console.log("onk valo chele")
 try{
   
    const {author, review, category,rating}=req.body
    console.log({author, review, category,rating})
    const reviews= new Reviews({
       rating:rating,
       review:review,
       author:author,
       category:category,
       slug:slugify(review)
      
    })
       const result=await  reviews.save()
     console.log(result)
     res.status(201).send({
        message:"successfully create your reviews",
        result:result,
        success:true
     })
    
 }
 catch(error){
    console.log(error)
 }

});





//get data from db :-Api is okay

router.get("/get-reviews",async (req, res) => {
    const reviews = await Reviews.find().populate("author","name").sort("-createdAt")
    res.status(201).send({
        totalreviews:reviews.length,
        reviews:reviews,
        success:true,
        message:"All the users"
    })
   
 
});

// single user from db by key:- Api is okay
router.get("/get-single-reviews/:id", async (req, res) => {
    const reviews = await Reviews.find(
        { _id: req.params.id }
    ).select('-photo')

    
    res.status(201).send({
      success:true,
      reviews:reviews
    })

});
// //getting photo:- Api is okay
// router.get("/user-photo/:id",async(req,res)=>{
//     try{
      
// const user= await User.findById(req.params.id).select('photo')

// if(user.photo.data){
//     res.set('Content-Type',user.photo.contentType)
//     return res.status(201).send(user.photo.data)
// }
//     }
//     catch (error){
// res.send({
//     message:"photo nai",
//     error:error
// })
//     }
// })
// //update data into db :
// router.put("/update-user/:id", async (req, res) => {

//     const user = await User.findByIdAndUpdate({ _id: req.params.id },
//         {
//             $set: {
//                 name: req.body.name

//             }
//         },
//         {
//             useFindAndModidy: false
//         }

//     )


   
//     res.status(201).send(user)

// });

//delete data from db :-  Api is okay.
router.delete("/delete-reviews/:id", async (req, res) => {
    const reviews = await Reviews.deleteOne({ _id: req.params.id }

    )

    res.status(201).send({
        message:"successfully deleted the review",
       reviews,
       success:true
    })

});

module.exports = router;