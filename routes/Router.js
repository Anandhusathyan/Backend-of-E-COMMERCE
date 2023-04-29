//const {getdata,createdata,checkout,paymentVerification}= require("../controller/logic")
//const route=require("express").Router;
// const {Router}=require("express");
// const Routers=Router(); 

const {mongo_Model,mong_paymodel} =require("../model/schema");

//Routers.get("/data",getdata);

const Razorpay=require("razorpay");
const crypto=require("crypto");


// Routers.route("/getdata").get(getdata);

// Routers.route("/postdata").post(createdata);

// Routers.route("/checkout").post(checkout);

// Routers.route("/paymentverification").post(paymentVerification);



// module.exports=Routers;


const Route=require("express").Router();

Route.get("/getdata",async (req,res)=>{

const Data = await mongo_Model.find().sort({order:-1})
.then(data=>res.status(200).send(data))
.catch(error=>console.log(res.status(500).json({error:"internal server error"})));
});

Route.post("/postdata", (req,res)=>{

const user = mongo_Model.create({
    game_name:req.body.game_name,
    Image:req.body.image1,
    Description:req.body.description,
    Price:req.body.price,
    more_details:req.body.details,
    Reviews:req.body.reviews,
})
.then((data)=>console.log(res.status(200).send(data),1))
.catch((error)=>console.log(res.send(error)))


console.log(user);
});

Route.post("/checkout",async (req,res)=>{

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  }); 

const options ={
    amount: Number(req.body.Price * 100), 
    currency: "INR"
};
console.log(instance,1)

const order= await instance.orders.create(options);

console.log("order", order);

res.status(200).json({
    success:true,
    order
});
});

Route.post("/paymentverification",(req,res)=>{

    console.log("req.body",req.body);
try{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");
    console.log("sig received " ,razorpay_signature);
    console.log("sig generated " ,expectedSignature);
    
    const authentication = expectedSignature === razorpay_signature

    if(authentication){

        // await mong_paymodel.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature
        // })

        res.redirect(`/checkoutsucess?reference=${razorpay_payment_id}`) 

    }
}
catch(error){
    res.send(error.message);
}    

});

module.exports=Route;