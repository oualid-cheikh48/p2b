const prisma = require("../config/prisma");

exports.getMessages = async () => {
  return prisma.message.findMany({
    include: { sender: true, receiver: true, property: true },
  });
};

exports.sendMessage = async (data) => {
  return prisma.message.create({
    data: {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      property_id: data.property_id,
      content: data.content,
    },
  });
};
