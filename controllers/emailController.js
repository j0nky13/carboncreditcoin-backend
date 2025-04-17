import Email from '../models/Email.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Email.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed' });
    }
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};