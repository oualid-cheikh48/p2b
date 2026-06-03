const reviewService = require("../services/review.service");

exports.getAllReviews = async (req, res) => {

  try {

    const reviews =
      await reviewService.getAllReviews();

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.createReview = async (req, res) => {

  try {

    const review =
      await reviewService.createReview(req.body);

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};