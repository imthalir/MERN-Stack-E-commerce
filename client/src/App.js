import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import banner_kids from './Components/Assets/banner_kids.png';
import banner_mens from './Components/Assets/banner_mens.png';
import banner_women from './Components/Assets/banner_women.png';
import MyOrders from './Pages/Orders';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function App() {

  const stripePromise = loadStripe('pk_test_51SMBTJGV2MboLWcTNtG9Z3URfLegcwjlRp0O628Q5UczdXIii1gc0pRUmWhjQW8cyQmYWXjxDByNcXlwWPjVQFr400Scm1Tz5u');

  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory banner={banner_mens} category="mens"/>}/>
        <Route path='/womens' element={<ShopCategory banner={banner_women} category="womens"/>}/>
        <Route path='/kids' element={<ShopCategory banner={banner_kids} category="kids"/>}/>
        <Route path='/orders' element={<MyOrders/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Elements stripe={stripePromise}><Cart /></Elements>}/>
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
