import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, email });
    await newUser.save();
    res.status(200).json({ message: 'User registered. OTP system coming soon!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};