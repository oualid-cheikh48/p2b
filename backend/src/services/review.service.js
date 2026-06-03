const prisma = require("../config/prisma");

exports.getAllReviews = async () => {
  return prisma.review.findMany({
    include: { reviewer: true, property: true },
  });
};

exports.createReview = async (data) => {
  return prisma.review.create({
    data: {
      booking_id: data.booking_id,
      reviewer_id: data.reviewer_id,
      property_id: data.property_id,
      rating: data.rating,
      comment: data.comment,
    },
  });
};
