const express=require("express")
const dotenv =require("dotenv")
const cors=require('cors')
const colors = require('colors')

const mongoose = require('mongoose');
const port= 5000
const app=express()


 app.use(cors())
dotenv.config()
app.use(express.json())


const userRouter=require("./routes/userrouter")
const categoryRouter=require("./routes/courseCategoryrouter")
const postRouter=require("./routes/postrouter")
const reviewsRouter=require("./routes/reviewsrouter")

const courseRouter=require("./routes/courseRouter")

// connection withe db:-
const uri = "mongodb+srv://ibrahim6454:sEqSz2tUrcJdkPaY@cluster0.4wzm5h8.mongodb.net/educational-site"
mongoose.set("strictQuery", true);
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
})
  .then(() => console.log('connection sucessful'))
  .catch((err)=>console.log(err,"this error come from here"));

//connection withe db:---------------

async function run(){
    
        try{ 
// start educational webpage:

app.use("/reviews",reviewsRouter)
app.use("/posts",postRouter)
app.use("/course",courseRouter)
app.use("/user",userRouter)
app.use("/category",categoryRouter)


//send sode of educational webpage:-
 
      }
      finally{

      }

}
run().catch(console.dir)




const errorHandler =(err,req,res,next)=>{
    if(res.headersSent){
        return next(err);
    }
    res.status(401).json({
        error:err
    })
}

app.use(errorHandler)



app.listen(port,()=>{
    console.log(port,"port")

});

// const client = new MongoClient(uri, { useNewUrlParser: true,
//      useUnifiedTopology: true, 
//      serverApi: ServerApiVersion.v1 });


// const productRouter=require("./routes/productrouter")
// const orderRouter=require("./routes/orderrouter")

// const authJwt = require("./helpers/authjwt");
// app.use(authJwt)

// const checkLogin =require("./middlewares/checklogin")
// const { MongoClient, ServerApiVersion} = require('mongodb');




// const bcrypt =require("bcrypt")

// const jwt =require("jsonwebtoken")


// const userSchema=require("./schemas/userSchema")

// const User= new mongoose.model("User",userSchema)
 //mohammadibrahim6454
        //ibWUdfbgoLQFHvtG

        //ibrahim6454
        //sEqSz2tUrcJdkPaY