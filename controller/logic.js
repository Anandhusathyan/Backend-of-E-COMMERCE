const Razorpay=require("razorpay");
const crypto=require("crypto");

const {mongo_Model,mong_paymodel} =require("../model/schema");

async function getdata(req,res){
   
        const Data = await mongo_Model.find().sort({order:-1})
        .then(data=>res.status(200).send(data))
        .catch(error=>console.log(res.status(500).json({error:"internal server error"})));
}

function createdata(req,res){
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
}



async function checkout(req,res){

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
}

async function paymentVerification (req,res){


    console.log("req.body",req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");
    console.log("sig received " ,razorpay_signature);
    console.log("sig generated " ,expectedSignature);
    
    const authentication = expectedSignature === razorpay_signature

    if(authentication){

        await mong_paymodel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

        res.redirect(`http://localhost:3000/checkoutsucess?reference=${razorpay_payment_id}`)

    }
    else{
        res.status(200).json({
            success: false 
        })
    }
}

module.exports={getdata,createdata,checkout,paymentVerification}