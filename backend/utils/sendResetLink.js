import nodemailer from "nodemailer"

const sendResetLink = async (email, resetLink) => {
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
    subject: "Reset your GoMeal password",
    html: `
      <div style="background:#fff9f6;padding:40px;font-family:Arial,sans-serif">
        <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:16px;padding:30px;border:1px solid #eee">

          <div style="text-align:center;margin-bottom:20px">
            <img 
              src="https://yourdomain.com/logo.png" 
              alt="GoMeal Logo" 
              style="height:60px;margin-bottom:10px"
            />
            <h2 style="color:#ff4d2d;margin:0">Reset Your Password</h2>
          </div>

          <p style="color:#333;font-size:15px">
            Hi 👋,<br/><br/>
            We received a request to reset your <b>GoMeal</b> account password.
            Click the button below to set a new password.
          </p>

          <div style="text-align:center;margin:30px 0">
            <a 
              href="${resetLink}"
              style="
                background:#ff4d2d;
                color:#ffffff;
                padding:14px 28px;
                border-radius:12px;
                text-decoration:none;
                font-weight:bold;
                display:inline-block
              "
            >
              Reset Password
            </a>
          </div>

          <p style="font-size:14px;color:#555">
            This link is valid for <b>15 minutes</b>.  
            If you did not request this, please ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:25px 0"/>

          <p style="font-size:12px;color:#888;text-align:center">
            For security reasons, never share this link with anyone.
            <br/><br/>
            © ${new Date().getFullYear()} GoMeal. All rights reserved.
          </p>

        </div>
      </div>
    `
  })
}

export default sendResetLink
