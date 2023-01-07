import express from "express"
import config from "./lib/config.json"
import * as NyLog from "./lib/NyLog"
import * as DB from "./lib/db"
import path from "path"
import session from "express-session"
const MySQLStore = require("express-mysql-session")(session)
import AuthInit from "./routers/auth"
import {} from "./lib/types/app"

const app = express()

const sessionStore = new MySQLStore({}, DB.pool)

app.use(session({
    secret: config.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}))
AuthInit(app)
app.use(async (req, res, next) => {
    if (req.user)
        res.locals.nick = req.user.nick
    if (req.originalUrl.includes("assets") || req.originalUrl.includes("/watch/stream") || req.originalUrl === "/favicon.ico") return next()
    NyLog.Log("connected page", {
        location: req.originalUrl,
        ip: req.ip
    })
    next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use("/assets", express.static(path.join(__dirname, "assets")))
app.use("/upload", require("./routers/upload"))
app.use("/watch", require("./routers/watch"))

app.get('/', async (req, res) => {
    return res.render("main")
})

app.listen(config.PORT, () => {
    NyLog.Success(`Express server launched on ${config.PORT}`)
})
