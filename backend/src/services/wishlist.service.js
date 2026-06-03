const prisma = require("../config/prisma");

exports.getWishlist = async () => {
  return prisma.wishlist.findMany({
    include: {
  user: true,
  property: {
    include: {
      images: true
    }
  }
},
  });
};

exports.addToWishlist = async (data) => {
  return prisma.wishlist.create({
    data: {
      user_id: data.user_id,
      property_id: data.property_id,
    },
  });
};

exports.removeFromWishlist = async (id) => {
  return prisma.wishlist.delete({
    where: { id },
  });
};