import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {



    const currency = '$';
    const delivery_fee = 10;
    const backendUrl =  import.meta.env.VITE_BACKEND_URL ;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({});
    const [token, setToken ] = useState('')
    const navigate = useNavigate()

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('select Product size');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);


        if (token) {
            try {
                
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
                
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    };


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue; // Handle the case where the product is not found. Important!
    
            for (const size in cartItems[items]) { // Use 'size' or another name, NOT 'item'
                try {
                    if (cartItems[items][size] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][size];
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
        }
        return totalAmount;
    };

const updateQuantity = async(itemId, size, quantity) => {
  

    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;

    setCartItems(cartData)

    if (token) {
        try {
            
            await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity},{headers:{token}})
        } catch (error) {
            console.log(error);
                toast.error(error.message)
        }
    }

}


const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/get',
        {}, // Request body (empty object in this case)
        { headers: { token } } // Headers including the token
      );
  
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        // Handle unsuccessful response from the server
        console.error("Server returned unsuccessful response:", response.data);
        toast.error(response.data.message || "Failed to get cart data."); // Use a server message if available
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error fetching cart data:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.data);
        console.error("Status code:", error.response.status);
        toast.error(error.response.data.message || "Server error occurred.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server:", error.request);
        toast.error("Network error occurred.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        toast.error("An unexpected error occurred.");
      }
  
    }
  };


const getProductsData = async () => {
    try {
        const response = await axios.get(backendUrl + '/api/product/list');
        if (response.data.success) {
            
            setProducts(response.data.products);
            
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};



useEffect(() => {
    getProductsData();
}, []);

useEffect(()=> {
    if (!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'))
        getUserCart((localStorage.getItem('token')))
    }
},[])


    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        addToCart,
        cartItems,
        getCartCount,
        updateQuantity ,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,token,
        setCartItems
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;