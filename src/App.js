import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './component/Navbar';
import AboutUs from './pages/AboutUs';
import Request from './pages/Request';
import Basket from './pages/Basket';




function App() {
  return (
    <div>
      <NavBar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductPage />}/>
      <Route path="/about-us" element={<AboutUs />} />
        <Route path="/request" element={<Request />} />
        <Route path="/basket" element={<Basket />} />
    </Routes>
    </div>
  );
}

export default App;
