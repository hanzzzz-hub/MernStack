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
      case "settlement":
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
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1 className="text-2xl">My Orders</h1>
      </div>
      {!orders[0] && <NoData />}
      {orders.map((order, index) => (
        <div
          key={order._id + index + "order"}
          className="order rounded p-4 bg-gray-100 shadow-sm mb-4 flex flex-col gap-3 sm:flex-row sm:gap-6 sm:items-center"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:w-3/4">
            <img
              src={order.product_details.image[0]}
              alt={order.product_details.name}
              className="w-16 h-16 object-cover rounded-md mb-3 sm:mb-0 sm:w-24 sm:h-24"
            />
            <div className="sm:ml-4">
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

          <div className="flex justify-between sm:w-1/4 sm:justify-end sm:gap-4 mt-3 sm:mt-0">
            <div className="text-lg">{getStatusIcon(order.payment_status)}</div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                onClick={() => alert("Edit order")}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => alert("Delete order")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
