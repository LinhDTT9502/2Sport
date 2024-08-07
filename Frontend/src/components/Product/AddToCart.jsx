
import { React,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { addToCart } from "../../services/cartService";
import { useParams } from "react-router-dom";

const AddToCart = () => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await addToCart(productId, quantity, token); 
        toast.success(`Sản phẩm đã được thêm vào giỏ hàng!`);
      } catch (error) {
        console.error(`${t("product_list.error_adding_product_to_cart")}:`, error);
        toast.error(`${t("product_list.error_adding_product_to_cart")}`);
      }
    } else {
      toast.info(`Bạn cần đăng nhập để thêm vào giỏ hàng!`);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-6">
      <div className="flex items-center">
        <button
          className="px-2 py-1 text-gray-700 hover:text-black focus:outline-none"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="px-4 py-1 text-black">{quantity}</span>
        <button
          className="px-2 py-1 text-gray-700 hover:text-black focus:outline-none"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-700 focus:outline-none"
          onClick={handleAddToCart}
        >
          {t("product_list.add_to_cart")}
        </button>
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none">
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
