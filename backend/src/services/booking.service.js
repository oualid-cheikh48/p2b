const prisma = require("../config/prisma");

exports.getAllBookings = async () => {
  return prisma.booking.findMany({
    include: { guest: true, property: true },
  });
};

exports.createBooking = async (data) => {
  return prisma.booking.create({
    data: {
      guest_id: data.guest_id,
      property_id: data.property_id,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      total_price: data.total_price,
    },
  });
};
