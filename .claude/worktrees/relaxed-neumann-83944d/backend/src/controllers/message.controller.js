const messageService = require("../services/message.service");

exports.getMessages = async (req, res) => {

  try {

    const messages =
      await messageService.getMessages();

    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.sendMessage = async (req, res) => {

  try {

    const message =
      await messageService.sendMessage(req.body);

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};