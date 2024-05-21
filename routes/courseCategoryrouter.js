const express =require("express")
const router =express.Router()
const mongoose= require("mongoose");
const courseCategorySchema = require("../Server/models/CourseCategory.js");
const { default: slugify } = require("slugify");
// const checklogin = require("../helpers/authjwt");




 const CourseCategory= new mongoose.model("CourseCategory",courseCategorySchema);

//create categiryinto db:-
router.post("/",async(req,res)=>{

const {name}=req.body

    const category= new  CourseCategory({
       name:name,
      slug:slugify(name)
      
    })
       console.log(category)
       const result=await  category.save()
     console.log(result)
     res.status(201).send(result)
   
   });
   

// //get data from db :-checklogin,
router.get("/", async(req,res)=>{
    const categories = await CourseCategory.find()
      
    res.status(201).send({
        success:true,
        message:"all category",
        categories
    })
     
});

// //search from db by key:-
// router.get("/:key",async(req,res)=>{
//     const course = await Course.find(
//         {name:req.params.key}
//     )
   
//        console.log(course)
//     res.send(course)
     
// });
// //update data into db :
// router.put("/:id",async(req,res)=>{
//     const product = await Course.findByIdAndUpdate({_id:req.params.id},
//         {
//             name:req.body.name,
//             price:req.body.price
      
//         },
//     {
//         useFindAndModidy:false
//     }
        
//     )
    
    
//        console.log(product)
//     res.send(product)
     
// });

// //deldete data from db :-
router.delete("/:id",async(req,res)=>{
    try{
        const category = await CourseCategory.deleteOne({_id:req.params.id} )

           res.status(201).send({
            message:"successfully deleted one category",
            success:true
        })
    }catch(error){
        res.status(500).send({
            message:"There is a problem",
            success:false
        })
    }
  
  
     
});

module.exports=router;