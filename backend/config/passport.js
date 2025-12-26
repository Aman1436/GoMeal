import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullName: profile.displayName,
            email,
            password: "GOOGLE_AUTH",
            mobile: "0000000000",
            role: "user",
            isVerified: true
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
