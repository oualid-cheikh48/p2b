const propertyService = require("../services/property.service");

exports.getAllProperties = async (req, res) => {

  try {

    const properties =
      await propertyService.getAllProperties();

    res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
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