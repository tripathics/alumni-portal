const express = require("express");
const { generateOTP, sendOtpEmail } = require("../../utility/otp.utility");
const router = express.Router();

router.post("/otp/generate", async (req, res) => {
  const { email } = req.body;
  console.log('email', email);
  
  try {
    const { otp } = await generateOTP(email);
    sendOtpEmail(otp, email);
    
    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
      email: email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error generating OTP",
    });
  }
})

module.exports = router;
