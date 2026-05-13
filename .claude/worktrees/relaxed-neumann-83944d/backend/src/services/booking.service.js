const prisma = require("../config/prisma");

exports.create = async (data) => {
  return prisma.booking.create({
    data: {
      guest_id: data.guest_id,
      property_id: data.property_id,
      start_date: data.start_date,
      end_date: data.end_date,
      total_price: data.total_price,
    },
  });
};

exports.getAll = async () => {
  return prisma.booking.findMany();
};