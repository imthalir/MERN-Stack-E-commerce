import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("https://shoppy-server-by-thalir.onrender.com/allorders");
    const data = await res.json();
    setOrders(data.reverse());
  };

  const updateOrderStatus = async (orderId, status) => {
    await fetch("https://shoppy-server-by-thalir.onrender.com/updateorderstatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId, status })
    });

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container my-5 py-4 bg-white">
      <h2 className="text-center mb-4">All Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders found.</div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Product Image</th>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <img
                          src={item.image || item.productId?.image}
                          alt={item.productId?.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </div>
                    ))}
                  </td>
                  <td className="text-wrap small">{order._id}</td>
                  <td className="text-wrap small">{order.userId}</td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.productId?.name || 'Product'} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <div>{order.paymentMethod}</div>
                    <span className={`badge rounded-pill mt-1 ${
                      order.paymentStatus === 'paid'
                        ? 'bg-success'
                        : order.paymentStatus === 'failed'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(order.status)} text-capitalize`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="form-select form-select-sm w-auto mx-auto"
                    >
                      {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'confirmed': return 'info';
    case 'shipped': return 'primary';
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    default: return 'light';
  }
};

export default Orders;
