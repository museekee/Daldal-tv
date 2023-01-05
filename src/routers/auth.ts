import passport from "passport";
import config from "./../lib/auth.json"
import { Express } from "express"
import path from "path"
import * as NyLog from "./../lib/NyLog"
import * as DB from "./../lib/db"

export default async function init(app: Express) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(async (profile: any, done) => {
        console.log(profile)
        if ((await DB.getUserById(`${profile.provider}-${profile.id}`)).length === 0) await DB.addUserByProfile({
            id: `${profile.provider}-${profile.id}`,
            email: profile.email,
            displayName: profile.displayName,
            picture: profile.picture
        })
        done(null, profile.id);
    })
    
    passport.deserializeUser(async (id: Express.User, done) => {
        console.log(id)
        done(null, id);
    })
    for (const obj of Object.entries(config)) {
        const key = obj[0]
        const item = obj[1]
        try {
            const auth = require(path.resolve(__dirname, "..", "lib", "auth", `auth_${key}.ts`))
            passport.use(new auth.config.strategy({
                clientID: item.clientID,
                clientSecret: item.clientSecret,
                callbackURL: item.callbackURL
            },
            async (accessToken: string, refreshToken: string, profile: any, done: (arg0: null, arg1: any) => any) => {
                console.log(profile)
                if ((await DB.getUserById(`${key}-${profile.id}`)).length === 0) await DB.addUserByProfile({
                    id: `${key}-${profile.id}`,
                    email: profile.email,
                    displayName: profile.displayName,
                    picture: profile.picture
                })
                return done(null, profile);
            }
            ))

            app.get(`/login/${key}`,
                passport.authenticate(key, { scope: ["email", "profile"] })
            )

            app.get(`/login/${key}/callback`, 
                passport.authenticate(key, {
                    successRedirect: "/",
                    failureRedirect: "/login",
                })
            )
            NyLog.Log(`OAuth Strategy \x1B[1m\x1B[33m${key}\x1B[0m loaded successfully.`)
        }
        catch(e: any) {
            NyLog.Error(`OAuth Strategy ${key} is not loaded`, {message: e.message})
        }
    }
}