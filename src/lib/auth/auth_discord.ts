import auth from "./../auth.json"
import { Strategy as DiscordStrategy } from 'passport-discord';

export const config = {
    strategy: DiscordStrategy,
    color: '#5865f2',
    fontColor: '#ffffff',
    vendor: 'discord',
    description: "디스코드 아이디로 로그인"
}
export const strategyConfig = {
    clientID: auth.discord.clientID,
    clientSecret: auth.discord.clientSecret,
    callbackURL: auth.discord.callbackURL,
    scope: ["identify", "email"]
}