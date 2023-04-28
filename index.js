const Express=require("express");
const app=Express();
const body=require("body-parser")
app.use(body.json())
app.use(body.urlencoded({ extended: true }));
// const stripe=require("./model/strip")

const Mongoose=require("mongoose");
const Route=require('./routes/Router')   
const dotenv=require('dotenv');
dotenv.config();
 

const cors=require("cors");
app.use(cors()); 

//app.use("/api/strip",stripe)

const port= process.env.PORT || 8080;

Mongoose.connect(process.env.Mongodb_URL)
.then((res)=>console.log(`connected to database ${res}`))
.catch(error=>console.log(`cannot connect to database ${error.message}`)); 

app.get("/",(req,res)=>{
    res.status(200).json({value:"This is home page"})  
})

app.use("/",Route);

app.get("/getkey", (req, res) => 
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.listen(port,()=>console.log(`Listening to port ${port}` )); 