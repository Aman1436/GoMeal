import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";
import OTP from "../models/otp.model.js";
import sendOtp from "../utils/sendOtp.js";
import crypto from "crypto"
import sendResetLink from "../utils/sendResetLink.js"
// Function to generate a 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signUp = async (req, res) => {
    try {
        const {fullName, email, password, mobile, role} = req.body;
        console.log(req.body);
        const user=await User.findOne({email});
        if(user && user.isVerified){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        if(mobile.length !== 10){
            return res.status(400).json({message:"Mobile number must be 10 digits long"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if(user){
            await User.deleteOne({ email });
        }
        await User.create({fullName, email, password: hashedPassword, mobile, role});
        await OTP.deleteOne({ email });
        const otp = generateOtp();
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // OTP valid for 2 minutes
        });
        await sendOtp(email, otp);
        console.log("OTP:", otp);
        res.status(200).json({ message: "OTP sent to email" });   
    }
    catch (error) {
        return res.status(500).json({message:"Server error while signing up"});
    }
}

const verifyOtp = async (req, res) => {
  try{
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email });
  if (!record) return res.status(400).json({ message: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  const user=await User.findOne({email});
    user.isVerified = true;
    await user.save();
  await OTP.deleteOne({ email });

  res.status(201).json({ message: "Email verified Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "OTP verification failed" });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP expired. Please signup again." });
    }

    if (otpDoc.resendCount >= 3) {
      return res.status(429).json({ message: "Resend limit reached. Try later." });
    }

    const now = new Date();
    const diff = (now - otpDoc.lastResendAt) / 1000;

    if (diff < 30) {
      return res.status(429).json({
        message: `Please wait ${Math.ceil(30 - diff)} seconds`
      });
    }

    const newOtp = generateOtp();

    otpDoc.otp = newOtp;
    otpDoc.resendCount += 1;
    otpDoc.lastResendAt = now;
    otpDoc.expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await otpDoc.save();
    await sendOtp(email, newOtp);

    return res.status(200).json({ message: "OTP resent successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Resend OTP failed" });
  }
};

const signIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token=await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({message:"Sign In error"});
    }
}
const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Sign Out successful"});
    }
    catch (error) {
        return res.status(500).json({message:"Sign Out error"});
    }
}
  const forgotPassword = async (req, res) => {
    try{
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendResetLink(user.email, resetLink);

  res.json({ message: "Reset password link sent successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Failed to send reset link" });
    }
}
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: "Password reset failed" });
  }
};

export {signUp, verifyOtp, resendOtp, forgotPassword, signIn, resetPassword, signOut};