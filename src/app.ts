import express from "express"
import config from "./lib/config.json"
import auth from "./lib/auth.json"
import * as NyLog from "./lib/NyLog"
import * as DB from "./lib/db"
import path from "path"
import session from "express-session"
const MySQLStore = require("express-mysql-session")(session)
import passport from "passport"
import { Google } from "./lib/types/app"
import DBType from "./lib/types/db"
const GoogleStrategy = require("passport-google-oauth2").Strategy

const app = express()

const sessionStore = new MySQLStore({}, DB.pool)

app.use(session({
    secret: config.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}))
app.use((req, res, next) => {
    if (req.originalUrl.includes("assets") || req.originalUrl === "/favicon.ico") return next()
    NyLog.Log("connected page", {
        location: req.originalUrl,
        ip: req.ip
    })
    next()
})
app.use(passport.initialize());
app.use(passport.session());
// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser((user: any, done) => {
    done(null, user.id);
})

// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
})

passport.use(
    new GoogleStrategy(
        {
            clientID: auth.google.clientID,
            clientSecret: auth.google.clientSecret,
            callbackURL: "http://localhost/login/google/callback",
            passReqToCallback: true,
        },
        async (request: any, accessToken: string, refreshToken: string, profile: Google, done: (arg0: null, arg1: any) => any) => {
            console.log(profile);
            // console.log(accessToken);
            if ((await DB.getUserById(`google-${profile.id}`)).length === 0) await DB.addUserByGoogleProfile(profile)
            
            return done(null, profile);
        }
    )
)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use("/assets", express.static(path.join(__dirname, "assets")))
app.use("/upload", require("./routers/upload"))

app.get('/', async (req, res) => {
    if (!req.session.passport?.user) return res.render("main")
    const user: DBType.User = (await DB.getUserById(`google-${req.session.passport.user}`))[0]
    return res.render("main", {
        nick: user.NICK
    })
})

app.get("/login", (req, res) => {
    if (req.user) return res.redirect("/");
    return res.render("main")
})
// google login 화면
app.get(
    "/login/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// google login 성공과 실패 리다이렉트
app.get(
    "/login/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
)
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/")
    })
});
app.listen(config.PORT, () => {
    NyLog.Success(`Express server launched on ${config.PORT}`)
})