const paymentService = require("../services/payment.service");

exports.getPayments = async (req, res) => {

  try {

    const payments =
      await paymentService.getPayments();

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.createPayment = async (req, res) => {

  try {

    const payment =
      await paymentService.createPayment(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};