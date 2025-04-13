
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'
import Razorpay from 'razorpay'

// Global Variables

const currency = 'inr'
const deliveryCharges = '10'

//gateaway initialize
const stripe = new Stripe(process.env.STRIPE_SECERET_KEY)
const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECERET
})


// placing order using cod method


const placeOrder = async (req, res) => {

    try {
        
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }


        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} }, 
            { new: true } 
          );
          if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
          }

        res.json({success:true, message:"Order Placed"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

// placing order using Stripe method


const placeOrderStripe = async (req, res) => {

    const { userId, items, amount, address } = req.body

    const { origin } = req.headers

    const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "Stripe",
        payment: false,
        date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    try {
        

        const line_items = items.map((item)=> ({
            price_data: {
                currency: currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url})

    
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// verify Stripe


const verifyStripe = async (req, res)=> {

    const { orderId, success, userId } = req.body

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true})
        } else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
    }


// placing order using RazorPaymethod


const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };

        razorpayInstance.orders.create(options, (err, order) => {  // <-- Corrected line
            if (err) { // <-- Use 'err' here
                console.error("Razorpay Error:", err); // More informative logging
                return res.status(500).json({ success: false, message: err.message || "Razorpay order creation failed" }); // Send a 500 status code
            }
            res.json({ success: true, order }); // Send the order object back to the client
        });

    } catch (error) {
        console.error("General Error:", error); // More informative logging
        res.status(500).json({ success: false, message: error.message || "An error occurred" }); // Send a 500 status code
    }
};

//Verify Razorpay


const verifyRazorpay = async (req, res) => {

    try {
        const { userId, razorpay_order_id} = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){

            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment: true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success: true, message: "payment Succesfull"})
        }else{
            res.json({success: false, message: "payment Failed"})
        }
        

    } catch (error) {
        console.error("General Error:", error); // More informative logging
        res.status(500).json({ success: false, message: error.message || "An error occurred" }); // Send a 500 status code
    }
}

// All orders data for admin panel

const allOrders = async(req, res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// User Order data for frontend

const userOrders = async(req, res) => {

    try {
        
        const { userId } = req.body 

        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//update order Status for admin panel

const updateStatus = async(req, res) => {

    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true, message: "Status Updated"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {verifyRazorpay,verifyStripe, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus}