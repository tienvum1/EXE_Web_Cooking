const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const Wallet = require("../models/Wallet");
require("dotenv").config();

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          "https://exe-web-cooking.onrender.com/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(
          "Google Strategy callback: Initiated for profile email:",
          profile.emails && profile.emails[0] ? profile.emails[0].value : "N/A"
        );
        try {
          console.log(
            "Google Strategy callback: Checking for user by googleId:",
            profile.id
          );
          // Check if user already exists with googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log(
              "Google Strategy callback: User found by googleId:",
              user._id
            );
            // User found by googleId, update avatar if needed
            if (profile.photos && profile.photos[0]) {
              console.log(
                "Google Strategy callback: Updating avatar for existing user from Google profile."
              );
              user.avatar = profile.photos[0].value;
              await user.save();
            }
            console.log(
              "Google Strategy callback: Calling done() with existing user."
            );
            return done(null, user);
          } else {
            console.log(
              "Google Strategy callback: No user found by googleId. Checking by email:",
              profile.emails[0].value
            );
            // No user found with googleId, check if user exists with the same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              console.log(
                "Google Strategy callback: User found by email:",
                user._id
              );
              // User found by email, link Google account if not already linked
              if (!user.googleId) {
                console.log(
                  "Google Strategy callback: Linking Google account to existing user."
                );
                user.googleId = profile.id;
              }
              if (!user.loginMethods.includes("google")) {
                console.log(
                  "Google Strategy callback: Adding google login method."
                );
                user.loginMethods.push("google");
              }
              // Update name if missing
              if (!user.fullName && profile.displayName) {
                console.log("Google Strategy callback: Updating fullName.");
                user.fullName = profile.displayName;
              }
              // Always update avatar if Google provides one
              if (profile.photos && profile.photos[0]) {
                console.log(
                  "Google Strategy callback: Updating avatar for linked user from Google profile."
                );
                user.avatar = profile.photos[0].value;
              }

              await user.save();
              console.log(
                "Google Strategy callback: Calling done() with linked user."
              );
              return done(null, user);
            } else {
              console.log(
                "Google Strategy callback: No user found by googleId or email. Creating new user."
              );
              // No user found by googleId or email, create a new user
              const newUser = new User({
                username: profile.emails[0].value.split("@")[0], // Generate username from email
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id, // Store googleId
                is_verified: true, // Assuming Google verified email
                role: "user", // Changed default role to 'user' to match model default
                avatar:
                  profile.photos && profile.photos[0]
                    ? profile.photos[0].value
                    : null, // Store avatar URL (Already takes from Google)
                loginMethods: ["google"], // Indicate Google login method
              });
              await newUser.save();

              // Tạo wallet mới với số dư 0 cho user
              const wallet = new Wallet({
                user: newUser._id,
                balance: 0,
              });
              await wallet.save();
              console.log(
                "Google Strategy callback: Created new wallet for user:",
                newUser._id
              );

              console.log(
                "Google Strategy callback: Calling done() with new user:",
                newUser._id
              );
              return done(null, newUser);
            }
          }
        } catch (error) {
          console.error("Error in Google Auth callback:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
