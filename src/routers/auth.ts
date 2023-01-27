import passport from "passport";
import config from "./../lib/auth.json"
import { Express } from "express"
import path from "path"
import * as NyLog from "./../lib/NyLog"
import * as DB from "./../lib/db"
import https from "https"

export default async function init(app: Express) {
    https.globalAgent.options.rejectUnauthorized = false;
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(async (profile: any, done) => {
        console.log(profile)
        const authutil = require(path.resolve(__dirname, "..", "lib", "utils", "auth", `${profile.provider}.ts`))
        const data = authutil.getData(profile)
        try {
            await DB.getUserById(`${profile.provider}-${profile.id}`)
        }
        catch {
            await DB.addUserByProfile({
                id: data.id,
                email: data.email,
                displayName: data.displayName,
                picture: data.picture
            })
        }
        done(null, {
            id: `${profile.provider}-${profile.id}`,
            nick: profile.displayName
        });
    })
    
    passport.deserializeUser(async (id: Express.User, done) => {
        done(null, id);
    })
    const authConfigs: any[] = []
    for (const key in config) {
        try {
            const auth = require(path.resolve(__dirname, "..", "lib", "auth", `auth_${key}.ts`))
            passport.use(new auth.config.strategy(
                {
                    clientID: auth.strategyConfig.clientID,
                    clientSecret: auth.strategyConfig.clientSecret,
                    callbackURL: auth.strategyConfig.callbackURL,
                },
                async (accessToken: string, refreshToken: string, profile: any, done: (arg0: null, arg1: any) => any) => {
                    return done(null, profile);
                }
            ))
            authConfigs.push(auth.config)
            app.get("/login", (req, res) => {
                if (req.user) return res.redirect("/");
                return res.render("login", {
                    auth: authConfigs
                })
            })
            
            app.get(`/login/${auth.config.vendor}`, passport.authenticate(key, { scope: auth.strategyConfig.scope }))
            app.get(auth.strategyConfig.callbackURL, passport.authenticate(key, {
                successRedirect: "/",
                failureRedirect: "/login",
            }))
            app.get("/logout", (req, res) => {
                req.logout(() => {
                    res.redirect("/")
                })
            })
            NyLog.log(`OAuth Strategy \x1B[1m\x1B[33m${key}\x1B[0m loaded successfully.`)
        }
        catch(e: any) {
            NyLog.error(`OAuth Strategy ${key} is not loaded`, e.message)
        }
    }
}