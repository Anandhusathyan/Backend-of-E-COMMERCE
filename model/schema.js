const Mongoose=require("mongoose");

const dev_use=new Mongoose.Schema({
    game_name:{
        required: true,
        type:String
    },
    Image:{
        required: true,
        type:String
    },
    Description:{
        required:true,
        type:String
    },
    Price:{
        required:true,
        type:String
    },
    more_details:{
        required:true,
        type:String
    },
    Reviews:{
        required:true,
        type:String
    },
    date:{
        type:Number,
        default: Date.now()
    }
})

const mongo_Model=Mongoose.model("deve",dev_use);

const payment_details=new Mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
      },
      razorpay_payment_id: {
        type: String,
        required: true,
      },
      razorpay_signature: {
        type: String,
        required: true,
      },
})

const mong_paymodel=Mongoose.model("payment_details",payment_details);

module.exports={mongo_Model,mong_paymodel};