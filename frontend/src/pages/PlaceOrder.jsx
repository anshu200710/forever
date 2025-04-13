import React, {useContext, useState} from 'react'
import Title from '../components/Title'

import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const PlaceOrder = () => {


  const [method, setMethod] = useState('cod')

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value


    setFormData(data=> ({...data,[name]:value}))
  }


  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'order payment',
      description: 'order payment',
      order_id: order.id,
      recipt: order.recipt,
      handler: async (response) => {
        console.log(response);
        try {
          
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {headers:{token}})
          if (data.success) {
            navigate("/orders")
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
        
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
        try {
          

          let orderItems = []
          
          for(const items in cartItems){
            for(const item in cartItems[items]){
              if (cartItems[items][item] > 0 ) {
                const itemInfo = structuredClone(products.find(product => product._id === items ))
                if (itemInfo) {
                  itemInfo.size = item
                  itemInfo.quantity = cartItems[items][item]
                  orderItems.push(itemInfo)
                }
              }
            }
          }


          let orderData = {
            address: formData,
            items: orderItems,
            amount: getCartAmount() + delivery_fee
          }

          switch(method){

            //api Calls for COD
            case 'cod' :

            const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
            
            if (response.data.success) {
              setCartItems({})
              navigate('/orders')
            }else{
              toast.error(response.data.message)
            }
            break;

            default:
              break;

       case 'stripe':
            const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}})
            
           if (responseStripe.data.success) {
            const {session_url } = responseStripe.data
            window.location.replace(session_url)
            
            }else{
              toast.error(responseStripe.data.message)
            }
             break;

        
         case 'razorpay':
             const  responseRazopay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } });
              if (responseRazopay.data.success) { // Use responseRazopay here
                  initPay(responseRazopay.data.order); // Corrected this as well.
              } else {
                  toast.error(responseRazopay.data.message); // And this too.
              }
              break;
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
  }
   



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* -------LEFT SIDE--------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">

        <div className="text-xl sm:text-2xl my-3">
           <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>

          <div className="flex gap-3">
        <input onChange={onChangeHandler} value={formData.firstName} required name="firstName" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />
        <input onChange={onChangeHandler} value={formData.lastName} required name="lastName" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
        </div>

        <div className="flex gap-3">
        <input onChange={onChangeHandler} value={formData.email} required name="email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address" />
        <input onChange={onChangeHandler} value={formData.street} required name="street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
        </div>

        <div className="flex gap-3">
        <input onChange={onChangeHandler} value={formData.city} required name="city" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
        <input onChange={onChangeHandler} value={formData.state} name="state" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
        </div>

        <div className="flex gap-3">
        <input onChange={onChangeHandler} value={formData.zipcode} required name="zipcode" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
        <input onChange={onChangeHandler} value={formData.country} required name="country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
        </div>

        <input onChange={onChangeHandler} value={formData.phone} required name="phone" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" ></input>
        
        </div>


        {/* RIGHT SIDE */}

        <div className="mt-8">
          <div className="mt-8 min-w-80">
          <CartTotal/>
        </div>

        {/* PAYMENT METHOD */}


        <div className="mt-12">
        <Title text1={'PAYMENT'} text2={'METHOD'}/>
        </div>
       <div className="flex gap-3 flex-col lg:flex-row">
        <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
          <p onClick={()=> setMethod('stripe')} className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'stripe'? "bg-green-400":'' } `}></p>
          <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
        </div>
        <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
          <p onClick={()=> setMethod('razorpay')} className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'razorpay'? "bg-green-400":'' }`}></p>
          <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
        </div>
        <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
          <p onClick={()=> setMethod('cod')} className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'cod'? "bg-green-400":'' }`}></p>
          <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
        </div>
       </div>
        <div className="w-full text-end mt-8">
        <button  type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
        </div>
      </div>
          </form>
        
      
   
  )
}

export default PlaceOrder
