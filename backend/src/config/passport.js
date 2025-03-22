import passport from "passport";
import { User } from "../models/user.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,
            authProvider: "google",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails && profile.emails[0]?.value;
        if (!email) return done(new Error("No email found from GitHub"), null);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || "GitHub User",
            email,
            isVerified: true,
            authProvider: "github",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
