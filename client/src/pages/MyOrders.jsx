import { useState, useEffect } from "react";
import "./MyOrders.css";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Dummy orders for now
    const dummyOrders = [
      { id: 1, product: "iPhone 14 Pro", price: 999, quantity: 1 },
      { id: 2, product: "Sony Headphones", price: 199, quantity: 2 },
    ];
    setOrders(dummyOrders);
  }, []);

  const increaseQty = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, quantity: order.quantity + 1 } : order
      )
    );
  };

  const decreaseQty = (id) => {
    setOrders((prev) =>
      prev
        .map((order) =>
          order.id === id ? { ...order, quantity: order.quantity - 1 } : order
        )
        .filter((order) => order.quantity > 0) // remove if 0
    );
  };

  const handleCheckout = () => {
    if (orders.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Proceeding to checkout!");
    // integrate payment API here
  };

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product}</td>
                <td>${order.price}</td>
                <td>
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(order.id)}
                  >
                    -
                  </button>
                  <span className="qty">{order.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(order.id)}
                  >
                    +
                  </button>
                </td>
                <td>${order.price * order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {orders.length > 0 && (
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      )}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}
