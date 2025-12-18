import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Get role from state parameter (passed from frontend)
          const role = req.query.state || 'student';

          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            if (!user.fullname) {
              user.fullname = profile.displayName;
            }
            if (!user.profile.profilePhoto && profile.photos[0]) {
              user.profile.profilePhoto = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Create new user with selected role
          const newUser = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: role, // Use role from state parameter
            authProvider: 'google',
            profile: {
              profilePhoto: profile.photos[0]?.value || ""
            }
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
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
      done(error, null);
    }
  });

  return passport;
}
