const notificationService =
require("../services/notification.service");

exports.getNotifications = async (req, res) => {

  try {

    const notifications =
      await notificationService.getNotifications();

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};