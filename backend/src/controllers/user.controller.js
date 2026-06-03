const service = require("../services/user.service");

exports.createUser = async (req, res) => {
  const user = await service.createUser(req.body);
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await service.getUsers();
  res.json(users);
};

exports.updateUser = async (req, res) => {
  try {
    const user = await service.updateUser(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};