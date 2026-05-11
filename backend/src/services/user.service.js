const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

exports.createUser = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password_hash: hash,
    },
  });
};

exports.getUsers = async () => {
  return prisma.user.findMany();
};