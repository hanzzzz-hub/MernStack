import React from "react";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaCreditCard,
} from "react-icons/fa"; // Importing icons
import NoData from "../components/NoData";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  console.log("Order Items", orders);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "paid":
        return <FaCreditCard className="text-blue-500" />;
      default:
        return <FaExclamationCircle className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>
      {!orders[0] && <NoData />}
      {orders.map((order, index) => (
        <div
          key={order._id + index + "order"}
          className="order rounded p-4 bg-gray-100 shadow-sm mb-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Order No: {order?.orderId}</p>
            <div className="text-lg">{getStatusIcon(order.payment_status)}</div>
          </div>
          <div className="flex gap-3 items-center">
            <img
              src={order.product_details.image[0]}
              alt={order.product_details.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <p className="font-medium text-gray-700">
                {order.product_details.name}
              </p>
              <p className="text-sm text-gray-600">
                Status: {order.payment_status}
              </p>
              <p className="font-medium text-gray-800">
                Price: {order.totalAmt}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
