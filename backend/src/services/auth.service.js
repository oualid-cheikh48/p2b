const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {
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

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password_hash, ...safeUser } = user;

  return { token, user: safeUser };
};