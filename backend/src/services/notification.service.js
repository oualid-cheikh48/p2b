const prisma = require("../config/prisma");

exports.getNotifications = async () => {
  return prisma.notification.findMany({
    include: { user: true },
  });
};
