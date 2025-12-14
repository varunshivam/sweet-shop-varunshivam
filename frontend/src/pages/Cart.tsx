import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../api";

interface CartItem {
  id: number;
  sweet_id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const res = await getCart();
    setCart(
      res.data.map((item: any) => ({
        ...item,
        price: Number(item.price),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="loading">Loading cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🛒 My Cart</h1>

      <div className="grid">
        {cart.map((item) => (
          <div className="sweet-card" key={item.id}>
            <h4>{item.name}</h4>
            <span className="category">{item.category}</span>

            <div className="price">₹{item.price}</div>

            <div style={{ margin: "10px 0" }}>
              <button
                disabled={item.quantity === 1}
                onClick={() =>
                  updateCartItem(item.id, item.quantity - 1).then(loadCart)
                }
              >
                ➖
              </button>

              <span style={{ margin: "0 10px" }}>{item.quantity}</span>

              <button
                onClick={() =>
                  updateCartItem(item.id, item.quantity + 1).then(loadCart)
                }
              >
                ➕
              </button>
            </div>

            <button
              className="danger"
              onClick={() => removeCartItem(item.id).then(loadCart)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "30px" }}>Total: ₹{total}</h2>
    </div>
  );
}
