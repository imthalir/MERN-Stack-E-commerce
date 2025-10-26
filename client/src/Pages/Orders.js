import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('auth-token');
    const res = await fetch('https://shoppy-server-by-thalir.onrender.com/myorders', {
      method: 'GET',
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setOrders(data.orders || []);
  };

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem('auth-token');
    const res = await fetch('https://shoppy-server-by-thalir.onrender.com/updateorderstatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ orderId, status: 'cancelled' })
    });

    const result = await res.json();
    if (result.success) {
      fetchOrders();
    } else {
      alert('Failed to cancel order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">You haven't placed any orders yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Product Image</th>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
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
                  <td>{order._id}</td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.productId?.name || 'Product'} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {(order.status === 'pending' || order.status === 'confirmed') ? (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
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

export default MyOrders;
