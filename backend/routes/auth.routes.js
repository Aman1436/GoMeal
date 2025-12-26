import express from 'express';
import { signUp,verifyOtp, signIn, signOut, resendOtp, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import passport from "passport";
import generateToken from "../utils/token.js";
import isAuth from '../middlewares/isAuth.js';

const authRouter = express.Router();

authRouter.post('/signup',signUp);
authRouter.post('/verify-otp',verifyOtp);
authRouter.post("/resend-otp", resendOtp);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/reset-password/:token',resetPassword);
authRouter.post('/signin',signIn);
authRouter.post('/signout',isAuth,signOut);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {

    const token = await generateToken(req.user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(process.env.FRONTEND_URL);
  }
);



export default authRouter;