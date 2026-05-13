const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {

    const user = await authService.register(req.body);

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

exports.login = async (req, res) => {

  try {

    const token = await authService.login(req.body);

    res.json(token);

  } catch (error) {

    res.status(401).json({
      error: error.message
    });

  }

};