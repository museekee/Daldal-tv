import express from "express"
import config from "./lib/config.json"
import * as NyLog from "./lib/NyLog"
import * as DB from "./lib/db"
import path from "path"
import session from "express-session"
const MySQLStore = require("express-mysql-session")(session)
import DBType from "./lib/types/db"
import AuthInit from "./routers/auth"
import type {} from "./lib/types/app"

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
AuthInit(app)

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
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/")
    })
});
app.listen(config.PORT, () => {
    NyLog.Success(`Express server launched on ${config.PORT}`)
})