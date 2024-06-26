import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import Home from "./components/Home";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import { ProductDetails } from "./components/product/ProductDetails";
import { NotFound } from "./components/layout/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;