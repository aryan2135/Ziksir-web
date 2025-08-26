import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../env";
import { User } from "../../models/user.model";
import { authService } from "../../services/user.service";

const verifyCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  },
  done: (err: any, user?: any) => void
) => {
  try {
    const user = await authService.loginViaGoogle(profile);
    return done(null, user);
  } catch (error) {
    return done(error, undefined); // ❌ Error case
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/user/auth/google/callback`,
      passReqToCallback: false,
    },
    verifyCallback
  )
);
