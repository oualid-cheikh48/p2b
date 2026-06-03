const wishlistService = require("../services/wishlist.service");

exports.getWishlist = async (req, res) => {

  try {

    const wishlist =
      await wishlistService.getWishlist();

    res.status(200).json({
      success: true,
      data: wishlist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.addToWishlist = async (req, res) => {

  try {

    const item =
      await wishlistService.addToWishlist(req.body);

    res.status(201).json({
      success: true,
      data: item
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.removeFromWishlist = async (req, res) => {
  try {
    await wishlistService.removeFromWishlist(parseInt(req.params.id));
    res.status(200).json({ success: true, message: "Retiré des favoris" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
