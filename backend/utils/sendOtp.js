import nodemailer from "nodemailer"

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"GoMeal 🍔" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your GoMeal account",
    html: `
      <div style="background:#fff9f6;padding:40px;font-family:Arial,sans-serif">
        <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:16px;padding:30px;border:1px solid #eee">

          <div style="text-align:center;margin-bottom:20px">
            <img 
              src="https://yourdomain.com/logo.png" 
              alt="GoMeal Logo" 
              style="height:60px;margin-bottom:10px"
            />
            <h2 style="color:#ff4d2d;margin:0">Verify Your Account</h2>
          </div>

          <p style="color:#333;font-size:15px">
            Hi 👋,<br/><br/>
            Thank you for signing up with <b>GoMeal</b>.
            Please use the OTP below to verify your email address.
          </p>

          <div style="background:#fff1ec;border-radius:12px;padding:20px;text-align:center;margin:25px 0">
            <h1 style="letter-spacing:6px;color:#ff4d2d;margin:0">${otp}</h1>
          </div>

          <p style="font-size:14px;color:#555">
            This OTP is valid for <b>5 minutes</b>.  
            Do not share it with anyone.
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:25px 0"/>

          <p style="font-size:12px;color:#888;text-align:center">
            If you didn’t request this, you can safely ignore this email.
            <br/><br/>
            © ${new Date().getFullYear()} GoMeal. All rights reserved.
          </p>

        </div>
      </div>
    `
  })
}

export default sendOtp
