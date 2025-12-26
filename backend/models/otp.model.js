import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
    resendCount: {
        type: Number,
        default: 0
    },
    lastResendAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
