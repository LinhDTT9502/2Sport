import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductList from '../pages/ProductList';
import ProductDetails from '../pages/ProductDetails';
import ProductPage from '../pages/ProductPage';
import AddToCart from "../components/Product/AddToCart";
const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path=":productId" element={<ProductDetails />} />
      <Route path=":productId" element={<AddToCart />} />
    </Routes>
  );
};

export default ProductRoutes;
