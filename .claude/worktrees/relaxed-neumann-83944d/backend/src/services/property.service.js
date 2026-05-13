const prisma = require("../config/prisma");

exports.create = async (data) => {
  return prisma.property.create({
    data,
  });
};

exports.getAll = async () => {
  return prisma.property.findMany({
    include: { owner: true },
  });
};

exports.getOne = async (id) => {
  return prisma.property.findUnique({
    where: { id: Number(id) },
  });
};