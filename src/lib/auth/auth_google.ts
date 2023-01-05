import config from "./../auth.json"
import Auth from "./../types/auth"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

module.exports.config = {
    strategy: GoogleStrategy,
    color: '#0F132F',
    fontColor: '#FFFFFF',
    vendor: 'daldalso'
}
module.exports.strategyConfig = {
    clientID: config.google.clientID, // 보안을 위해서입니다.
    clientSecret: config.google.clientSecret, // 이 방법을 사용하는 것을
    callbackURL: config.google.callbackURL, // 적극 권장합니다.
    passReqToCallback: true
}