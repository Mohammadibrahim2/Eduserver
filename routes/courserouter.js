const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const courseSchema = require("../Server/models/Course.js");
const { default: slugify } = require("slugify");
const formidableMiddleware = require('express-formidable');
const fs = require("fs");
// const checklogin = require("../helpers/authjwt");


const Course = new mongoose.model("Course", courseSchema);

//create product into db:-
router.post("/create-course", formidableMiddleware(), async (req, res) => {


    const { name, description, tittle, author, category } = req.fields;

    const { photo } = req.files;
    switch (true) {
        case !name:
            return req.status(500).send({ error: "name is requried" });
        case !category:
            return req.status(500).send({ error: "category is requried" });
        case !description:
            return req.status(500).send({ error: "description is requried" });
        case !author:
            return req.status(500).send({ error: "author is requried" });
        case !tittle:
            return req.status(500).send({ error: "tittleis requried" });

        case photo && photo.size > 1000000:
            return req.status(500).send({ error: "photo is requried and should be lezz than 1mb" });

    }

    const course = new Course({ ...req.fields, slug: slugify(name) })
    if (photo) {
        course.photo.data = fs.readFileSync(photo.path)
        course.photo.contentType = photo.type
    }


    let newCourse = new Course({
        name: name,
        author: author,
        category: category,
        description: description,
        tittle: tittle,
        photo: course.photo,
        slug: slugify(name),


    })

    const createdCourse = await newCourse.save()

    res.status(201).send({
        success: true,
        message: "successfully create a course by admin",
        createdCourse,
    })

    if (!createdCourse)
        return res.status(400).send("the course can not be created")

});


//get data from db :-checklogin,
router.get("/get-courses", async (req, res) => {

    const courses = await Course.find().populate("author", "name").select('-photo').sort("-createdAt")

    res.status(201).send({
        totalcourse: courses.length,
        success: true,
        message: "all course",
        courses
    })


});

//search from db by key:-
router.get("/single-course/:id", async (req, res) => {
    console.log(req.params.id)

    const singleCourse = await Course.findOne(

        { _id: req.params.id }
    ).populate("author", "name").populate("category").select('-photo')

    res.status(201).send({
        success: true,
        message: "single course",
        singleCourse
    })

});
//related course:-
router.get("/related-course/:pid/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const relatedCourse = await Course.find({
            category:cid,
            _id:{$ne:pid}

        }).populate("category")
        .select('-photo')
        .limit(3)

        res.status(201).send({
            success: true,
            message: "related  courses",
            relatedCourse
        })
    }
    catch(error){
        res.status(500).send({
            message:"there is a problem",
            success:false
        })
    }

 
});



//getting photo:- Api is okay
router.get("/course-photo/:id", async (req, res) => {

    try {
        const coursePhoto = await Course.findById(req.params.id).select("photo")
        if (coursePhoto.photo.data) {
            res.set('Content-Type', coursePhoto.photo.contenttype)
            return res.status(201).send(coursePhoto.photo.data)
        }

    }
    catch (error) {
        res.send({
            error: error,
            message: "there is an error"
        })
    }
});
//delete data from db :-  Api is okay.
router.delete("/delete-course/:id", async (req, res) => {
    const course= await Course.deleteOne({ _id: req.params.id }

    )

    res.status(201).send({
        message:"successfully deleted the course",
        course,
        success:true
    })

});

module.exports = router;
