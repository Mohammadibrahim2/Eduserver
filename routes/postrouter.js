const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const postSchema = require("../Server/models/Post.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const checklogin = require("../Server/helpers/authjwt.js");
const formidableMiddleware = require('express-formidable');
const fs = require("fs");
const { default: slugify } = require("slugify");
const Posts = new mongoose.model("Post", postSchema);

//create product into db:-
router.post("/create-posts", formidableMiddleware(), async (req, res) => {

    const { tittle, description, author, } = req.fields;

    const { photo } = req.files;
    switch (true) {
        
        case !tittle:
            return req.status(500).send({ error: "tittle is requried" });
        case !description:
            return req.status(500).send({ error: "description is requried" });
        case !author:
            return req.status(500).send({ error: "author is requried" });

        case photo && photo.size > 1000000:
            return req.status(500).send({ error: "photo is requried and should be lezz than 1mb" });

    }

    const posts = new Posts({ ...req.fields, slug: slugify(tittle) })
    if (photo) {
        posts.photo.data = fs.readFileSync(photo.path)
        posts.photo.contentType = photo.type
    }


    let newPosts = new Posts({
        author: author,
        tittle: tittle,
        description: description,
        photo: posts.photo,
        slug: slugify(tittle),


    })

    const createdPosts = await newPosts.save()

    res.status(201).send({
        success: true,
        message: "successfully create an post",
        createdPosts,
    })

    if (!createdPosts)
        return res.status(400).send("the post can not be created")




});


//get data from db :-Api is okay

router.get("/get-posts", async (req, res) => {
   try{
    const posts = await Posts.find().select("-photo").populate("author","name").sort("-createdAt")
    res.status(201).send({
        totalPosts: posts.length,
        posts:posts,
        success:true,
   
        message: "All the Posts"
    })
   }
   catch(error){
    res.status(500).send({
        message:"there is a problem",
        success:false
    })
   }


});

//get posts photos:
router.get("/posts-photo/:id", async (req, res) => {

    try {
        const postsPhoto = await Posts.findById(req.params.id).select("photo")
        if (postsPhoto.photo.data) {
            res.set('Content-Type', postsPhoto.photo.contenttype)
            return res.status(201).send(postsPhoto.photo.data)
        }

    }
    catch (error) {
        res.send({
            error: error,
            message: "there is an error"
        })
    }
})

// single course from db by key:- Api is okay
router.get("/get-single-post/:id", async (req, res) => {
    const user = await Posts.find(
        { _id: req.params.id }
    ).select('-photo')


    res.status(201).send(user)

});

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
router.delete("/delete-posts/:id", async (req, res) => {
    const posts= await Posts.deleteOne({ _id: req.params.id }

    )

    res.status(201).send({
        message:"successfully deleted the post",
        posts,
        success:true
    })

});
//for login user:-In complete

module.exports = router;