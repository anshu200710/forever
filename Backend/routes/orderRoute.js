import express from 'express'
import {verifyStripe, verifyRazorpay, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js'


const orderRouter = express.Router()

//Admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//user Features
orderRouter.post('/userorders',authUser,userOrders)

//Verify Payment 
orderRouter.post('/verifyStripe',authUser, verifyStripe)
orderRouter.post('/verifyRozerpay',authUser, verifyRazorpay)


export default orderRouter