import { addToCartAPI, getCartAPI, reduceCartItemAPI, remmoveCartItemAPI, updateCartItemQuantityAPI } from '../api/apiCart';
import { toast } from "react-toastify";

export const addToCart = async (productId, quantityToAdd, token) => {
  try {
    console.log('check',productId, quantityToAdd, token);
    const response = await addToCartAPI(productId, quantityToAdd, token);
    return response.data;
  } catch (error) {
    console.error('Thêm vào giỏ hàng thất bại:', error);
    toast.error("Chỉ còn 1 sản phẩm!");
    throw error;
  }
};

export const getUserCart = async (sortBy = '') => {
  try {
    const response = await getCartAPI(sortBy);
    return response.data.data.$values;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    throw error;
  }
};

export const reduceCartItem = async (id, token) => {
  try {
    const response = await reduceCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error('Lỗi khi giảm số lượng sản phẩm:', error);
    throw error;
  }
};

export const removeCartItem = async (id, token) => {
  try {
    const response = await remmoveCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm khỏi giỏ hàng:', error);
    toast.error('Lỗi khi xoá sản phẩm khỏi giỏ hàng');
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity, token) => {
  try {
    const response = await updateCartItemQuantityAPI(cartItemId, quantity, token);
    toast.success("Cập nhật số lượng sản phẩm trong giỏ hàng thành công");
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
    toast.error('Lỗi khi cập nhật số lượng sản phẩm: ' + error.message);
    throw error;
  }
};
