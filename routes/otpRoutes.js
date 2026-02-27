const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const otpStore = {};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ error: "Mobile number required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[mobile] = {
    otp,
    expiresAt: Date.now() + 60000 // 60 seconds
  };

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  const record = otpStore[mobile];

  if (!record) {
    return res.status(400).json({ error: "No OTP found" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[mobile];
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[mobile];

  res.json({ message: "OTP verified successfully" });
});

module.exports = router;