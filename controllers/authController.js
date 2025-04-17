import User from '../models/User.js';
import crypto from 'crypto';
import twilio from 'twilio';

// Initialize Twilio client (moved to top-level)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Handle user registration
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

// Send OTP via email or SMS
export const sendOTP = async (req, res) => {
  const { contact, method } = req.body;

  if (!contact || !method) {
    return res.status(400).json({ message: 'Contact and method are required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  try {
    const filter = method === 'email' ? { email: contact } : { phone: contact };
    const update = {
      ...(method === 'email' ? { email: contact } : { phone: contact }),
      otp,
      otpExpiresAt,
    };

    // Send the OTP
    if (method === 'sms') {
      await twilioClient.messages.create({
        body: `Your CO2TAX verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact,
      });
    } else {
      // Replace with Resend/Nodemailer later
      console.log(`Email OTP for ${contact}: ${otp}`);
    }

    // Save/update the user
    await User.findOneAndUpdate(filter, update, { upsert: true, new: true });

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('❌ Failed to send OTP:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { contact, method, otp } = req.body;

  if (!contact || !method || !otp) {
    return res.status(400).json({ message: 'Contact, method, and OTP are required.' });
  }

  try {
    const filter = method === 'email' ? { email: contact } : { phone: contact };
    const user = await User.findOne(filter);

    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(403).json({ message: 'OTP expired' });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('❌ Failed to verify OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};