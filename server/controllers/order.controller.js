import midtransClient from "midtrans-client";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Set true jika di production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const updatePaymentStatus = async (orderId, paymentStatus) => {
  await OrderModel.updateMany(
    { orderId: orderId },
    { payment_status: paymentStatus }
  );
};

export const checkPendingPayments = async () => {
  try {
    const pendingOrders = await OrderModel.find({ payment_status: "PENDING" });

    for (const order of pendingOrders) {
      const orderId = order.orderId;

      // Memeriksa status pembayaran dari Midtrans
      const statusResponse = await snap.transaction.status(orderId);

      // Memperbarui status pembayaran di database jika ada perubahan
      if (statusResponse.transaction_status !== "PENDING") {
        await OrderModel.updateOne(
          { orderId: orderId },
          { payment_status: statusResponse.transaction_status }
        );
      }
    }
  } catch (error) {
    console.error("Error checking pending payments:", error);
  }
};

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    // Remove from the cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const items = list_items.map((item) => {
      return {
        id: item.productId._id,
        price: pricewithDiscount(item.productId.price, item.productId.discount),
        quantity: item.quantity,
        name: item.productId.name,
      };
    });

    const orderId = `ORD-${new mongoose.Types.ObjectId()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmt, // total amount in IDR
      },
      credit_card: {
        secure: true,
      },
      item_details: items,
      customer_details: {
        email: user.email,
        first_name: user.name,
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/success`, // Redirect ke halaman sukses
        unfinish: `${process.env.FRONTEND_URL}/cancel`, // Redirect ke halaman gagal
      },
    };

    const midtransResponse = await snap.createTransaction(parameter);
    // console.log("Sending request to Midtrans:", parameter);
    // console.log("Midtrans Response:", midtransResponse);

    // Jika transaksi sukses, buat order di database dan hapus dari keranjang
    if (midtransResponse.token) {
      const payload = list_items.map((el) => {
        return {
          userId: userId,
          orderId: orderId,
          productId: el.productId._id,
          product_details: {
            name: el.productId.name,
            image: el.productId.image,
          },
          paymentId: midtransResponse.token,
          payment_status: "PENDING", // Status awal sebelum dikonfirmasi
          delivery_address: addressId,
          subTotalAmt: subTotalAmt,
          totalAmt: totalAmt,
        };
      });

      await OrderModel.insertMany(payload);
      await CartProductModel.deleteMany({ userId: userId });
      await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
    }

    return response.status(200).json(midtransResponse);
  } catch (error) {
    return response.status(500).json({
      message: error.message || "An error occurred",
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  for (const item of lineItems) {
    const paylod = {
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: item.id,
      product_details: {
        name: item.name,
        image: item.image, // Pastikan Anda memiliki gambar di item
      },
      paymentId: paymentId,
      payment_status: payment_status,
      delivery_address: addressId,
      subTotalAmt: Number(item.price / 100), // Mengubah dari cents ke unit
      totalAmt: Number(item.price / 100), // Mengubah dari cents ke unit
    };

    productList.push(paylod);
  }

  return productList;
};

// Webhook untuk Midtrans
export async function webhookMidtrans(request, response) {
  const event = request.body;

  // Handle the event
  switch (event.transaction_status) {
    case "capture":
    case "settlement":
      const userId = event.customer_id; // Ambil userId dari data yang sesuai
      const orderProduct = await getOrderProductItems({
        lineItems: event.item_details, // Ambil item_details dari event
        userId: userId,
        addressId: event.delivery_address, // Sesuaikan dengan data yang Anda butuhkan
        paymentId: event.transaction_id,
        payment_status: event.transaction_status,
      });

      const order = await OrderModel.insertMany(orderProduct);

      // Hapus item dari keranjang setelah pembayaran berhasil
      await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
      await CartProductModel.deleteMany({ userId: userId });

      // Update status pembayaran jika perlu
      await updatePaymentStatus(event.order_id, event.transaction_status);

      break;
    default:
      console.log(`Unhandled event type ${event.transaction_status}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId; // order id

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
