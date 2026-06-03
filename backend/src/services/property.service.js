const prisma = require("../config/prisma");

exports.getAllProperties = async (filters = {}) => {
  const where = {};

  if (filters.owner_id) {
  where.owner_id = parseInt(filters.owner_id);
  }
  if (filters.city) {
    where.city = { contains: filters.city, mode: "insensitive" };
  }
  if (filters.property_type) {
    where.property_type = filters.property_type;
  }
  if (filters.min_price) {
    where.price_per_night = { ...where.price_per_night, gte: parseFloat(filters.min_price) };
  }
  if (filters.max_price) {
    where.price_per_night = { ...where.price_per_night, lte: parseFloat(filters.max_price) };
  }
  if (filters.guests) {
    where.max_guests = { gte: parseInt(filters.guests) };
  }

  return prisma.property.findMany({
    where,
    include: { owner: true, images: true },
  });
};

exports.getPropertyById = async (id) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: true,
      images: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });
  if (!property) throw new Error("Property not found");
  return property;
};

exports.createProperty = async (data) => {
  return prisma.property.create({ data });
};

exports.updateProperty = async (id, data) => {
  return prisma.property.update({ where: { id }, data });
};

exports.deleteProperty = async (id) => {
  return prisma.property.delete({ where: { id } });
};

exports.deletePropertyImage = async (imageId) => {
  return prisma.propertyImage.delete({ where: { id: imageId } });
};