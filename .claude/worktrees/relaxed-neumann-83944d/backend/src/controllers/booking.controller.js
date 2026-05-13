const bookingService = require("../services/booking.service");

exports.getAllBookings = async (req, res) => {

  try {

    const bookings =
      await bookingService.getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.createBooking = async (req, res) => {

  try {

    const booking =
      await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};