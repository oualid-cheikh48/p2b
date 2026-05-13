const prisma = require("../config/prisma");

exports.getAllProperties = async () => {
  return prisma.property.findMany({
    include: { owner: true, images: true },
  });
};

exports.getPropertyById = async (id) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { owner: true, images: true, amenities: true },
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
