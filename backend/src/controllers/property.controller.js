const propertyService = require("../services/property.service");

exports.getAllProperties = async (req, res) => {
  try {
    const filters = {
      city: req.query.city,
      property_type: req.query.property_type,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      guests: req.query.guests,
      owner_id: req.query.owner_id,
    };

    const properties = await propertyService.getAllProperties(filters);

    res.status(200).json({
      success: true,
      data: properties,
      total: properties.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPropertyById = async (req, res) => {

  try {

    const property =
      await propertyService.getPropertyById(
        parseInt(req.params.id)
      );

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

exports.createProperty = async (req, res) => {

  try {

    const property =
      await propertyService.createProperty(req.body);

    res.status(201).json({
      success: true,
      data: property
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateProperty = async (req, res) => {

  try {

    const property =
      await propertyService.updateProperty(
        parseInt(req.params.id),
        req.body
      );

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.deleteProperty = async (req, res) => {

  try {

    await propertyService.deleteProperty(
      parseInt(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};