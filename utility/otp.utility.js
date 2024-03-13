import { createRequire } from 'module';
import { createTransport } from 'nodemailer';
import { Router } from 'express';
import getDb from '../db/conn_new_new.js';

const require = createRequire(import.meta.url);
require('dotenv').config();

const router = Router();
const db = await getDb();

const transporter = createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});
transporter.verify((error) => {
  if (error) {
    console.log(error);
    return error;
  }
  console.log('SMTP connection verified! Ready for emails');
});

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const generateOTP = async (email) => {
  // check if email is valid
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }

  const otp = Math.floor(Math.random() * 10e5).toString().padEnd(6, '0');
  // store the otp in database
  try {
    const [result] = await db.query('SELECT * FROM otp_email_attempts WHERE email = ?', [email]);
    if (result.length === 0) {
      await db.query('INSERT INTO otp_email_attempts (email) VALUES (?)', [email]);
      await db.query(`
        INSERT INTO otp_email (email, otp, status) VALUES (?, ?, false)
        ON DUPLICATE KEY UPDATE otp = ?, status = false
        `, [email, otp, otp]);
    } else {
      if (result[0].attempts >= 5 && result[0].email === email) {
        throw new Error('OTP: Max limit reached');
      }
      await db.query('UPDATE otp_email_attempts SET attempts = ? WHERE email = ?', [result[0].attempts + 1, email]);
      if (result[0].attempts + 1 >= 5) {
        // schedule a job for resetting attempts to 0 for that email 24 hrs later
      }
      await db.query(`
        INSERT INTO otp_email (email, otp, status) VALUES (?, ?, false)
        ON DUPLICATE KEY UPDATE otp = ?, status = false
        `, [email, otp, otp]);
    }
    return { otp, email };
  } catch (err) {
    console.error(err);
    throw new Error('Error generating OTP');
  }
};

const verifyOtp = async (otp, email) => {
  // search the email in otp_email table
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }
  if (otp.length !== 6 || Number.isNaN(otp)) {
    throw new Error('Invalid OTP');
  }
  try {
    const [otps] = await db.query('SELECT * FROM otp_email WHERE email = ?', [email]);
    if (otps.length === 0) {
      throw new Error('OTP Expired');
    }
    if (otps[0].otp === otp) {
      await db.query('DELETE FROM otp_email WHERE email = ?', [email]);
      return {
        message: `OTP Verified for ${email}`,
        success: true,
      };
    }
    // increment the number of attempts in otp_email_attempts
    const [otpAttempts] = await db.query('SELECT * FROM otp_email_attempts WHERE email = ?', [email]);
    const attempts = otpAttempts[0] ? otpAttempts[0].attempts + 1 : 1;
    await db.query(`INSERT INTO otp_email_attempts (email, attempts) VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE attempts = ?
    `, [email, attempts, attempts]);
    return {
      success: false,
      message: `Incorrect OTP. ${5 - attempts} attempts left`,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Error verifying OTP');
  }
};

const sendOtpEmail = (otp, email) => {
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your NIT AP Alumni account OTP</title>
<style>
* {
margin: 0;
padding: 0;
}
body {
font-family: "Arial", sans-serif;
background-color: #f2f8f8;
margin: 0;
padding: 0;
padding-top: 2rem;
}
.container {
background-color: #fff;
box-shadow: rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px,
rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px;
border-radius: 2px;
padding: 1.4rem;
max-width: 380px;
margin: auto;
}
.header {
text-align: center;
}
h1 {
font-size: 1.2rem;
font-weight: 300;
margin: 1rem 0;
font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
p {
font-size: 1rem;
color: #333;
}
.primary {
color: #18621f;
}
main {
text-align: center;
}
.otp-box-wrapper {
position: relative;
height: 2.8rem;
}
.otp-box {
position: absolute;
left: 50%;
transform: translateX(-50%);
border: solid 1px rgba(0,0,0,0.11);
box-shadow: rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px;
padding: 0.3rem 0.6rem;
margin: 0.4rem 0;
}
.otp {
font-family: "Courier New", Courier, monospace;
}
.footer {
margin-top: 2rem;
font-size: 0.9rem;
}
.footer h4 {
margin: 1.4rem 0 0.2rem;
}
.footer > * {
font-size: inherit;
}
</style>
</head>
<body>
<div class="container">
<header class="header">
<img
src="http://localhost:5173/navbar-banner.svg"
alt="NIT Arunachal Pradesh Alumni Association"
style="width: 200px; height: auto"
/>
</header>
<main>
<h1 class="primary">OTP for your NIT AP Alumni Account</h1>
<div>
<p>Your One Time Password is</p>
<div class="otp-box-wrapper">
<div class="otp-box">
<strong class="otp">${otp}</strong>
</div>
</div>
</div>
<p>This OTP will expire in 5 minutes</p>
</main>
<footer class="footer">
<h4>Best Regards</h4>
<p>
Alumni association<br />
NIT Arunachal Pradesh
</p>
</footer>
</div>
</body>
</html>
  `;
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `NIT AP Alumni OTP - ${otp}`,
    html: emailHtml,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err, 'Error sending email');
      throw new Error('Error sending OTP email');
    }
    console.log(info);
    return {
      message: `OTP ${otp} sent to ${email}`,
      success: true,
    };
  });
};

router.get('/send-email', (req, res, next) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: 'shyam.bonkers@gmail.com',
    subject: 'Test email',
    text: 'This is a test email',
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    console.log(info);
    res.status(200).json({
      success: true,
      message: 'Email sent',
    });
  });
});

export {
  generateOTP,
  verifyOtp,
  sendOtpEmail,
};
