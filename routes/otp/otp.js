import { Router } from 'express';
import { generateOTP, sendOtpEmail } from '../../utility/otp.utility.js';

const router = Router();

router.post('/otp/generate', async (req, res) => {
  const { email } = req.body;
  console.log('email', email);

  try {
    const { otp } = await generateOTP(email);
    sendOtpEmail(otp, email);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
      email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Error generating OTP',
    });
  }
});

export default router;
