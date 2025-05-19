const User = require('../models/User');
const { hash, compare } = require('../utils/hash');
const { sign } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.findOne({ $or: [{ username }, { email }] }))
    return res.status(400).json({ message: 'User exists' });
  const user = await User.create({ username, email, password: hash(password) });
  res.json({ token: sign({ id: user._id, username: user.username }) });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !compare(password, user.password))
    return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ token: sign({ id: user._id, username: user.username }) });
};