// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
// import auth from "./../lib/auth.json"
// import * as DB from "./../lib/db"
// import { Express } from "express"

// export function configurePassport() {
//   passport.use(new GoogleStrategy({
//       clientID: auth.google.clientID,
//       clientSecret: auth.google.clientSecret,
//       callbackURL: "http://localhost/login/google/callback"
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         if ((await DB.getUserById(`google-${profile.id}`)).length === 0) await DB.addUserByGoogleProfile(profile)
//         return done(null, profile);
//     }
//   ));
// }

// export function initializePassport(app: Express) {
//   app.use(passport.initialize());
//   app.use(passport.session());
// }

// export function authenticateWithGoogle(app: Express) {
//   app.get('/login/google',
//     passport.authenticate('google', { scope: ['profile'] }));

//   app.get('/login/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//       // Successful authentication, redirect home.
//       res.redirect('/');
//     });
// }