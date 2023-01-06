import auth from "./../auth.json"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

export const config = {
    strategy: GoogleStrategy,
    color: '#ffffff',
    fontColor: '#222222',
    vendor: 'google',
    description: "구글 아이디로 로그인"
}
export const strategyConfig = {
    clientID: auth.google.clientID,
    clientSecret: auth.google.clientSecret,
    callbackURL: auth.google.callbackURL
}