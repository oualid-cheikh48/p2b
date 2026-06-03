const prisma = require("../config/prisma");

exports.getPayments = async () => {
  return prisma.payment.findMany({
    include: { booking: true },
  });
};

exports.createPayment = async (data) => {
  return prisma.payment.create({
    data: {
      booking_id: data.booking_id,
      amount: data.amount,
      payment_status: data.payment_status || "pending",
      payment_method: data.payment_method,
      transaction_id: data.transaction_id,
    },
  });
};
