import auth from "./../auth.json"
import { Strategy as DaldalsoStrategy } from 'passport-daldalso';

export const config = {
    strategy: DaldalsoStrategy,
    color: '#0000ff',
    fontColor: '#ffff00',
    vendor: 'daldalso',
    description: "달달소 아이디로 로그인"
}
export const strategyConfig = {
    clientID: auth.daldalso.clientID,
    clientSecret: auth.daldalso.clientSecret,
    callbackURL: auth.daldalso.callbackURL,
    scope: null
}