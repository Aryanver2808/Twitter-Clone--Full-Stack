import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// In-memory OTP store (use Redis/DB in production)
const otpStore = {};

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, msg: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // valid 5 mins

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Audio Upload OTP",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, msg: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Error sending OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email]) return res.json({ success: false, msg: "No OTP found" });

  const { otp: correctOtp, expires } = otpStore[email];
  if (Date.now() > expires) return res.json({ success: false, msg: "OTP expired" });

  if (parseInt(otp) === correctOtp) {
    delete otpStore[email]; // clear OTP
    return res.json({ success: true });
  }

  res.json({ success: false, msg: "Invalid OTP" });
});

export default router;
