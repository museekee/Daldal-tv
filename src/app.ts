import express from "express"
import config from "./lib/config.json"
import * as NyLog from "./lib/NyLog"
import * as DB from "./lib/db"
import path from "path"
import session from "express-session"
const MySQLStore = require("express-mysql-session")(session)
import passport from "passport"
import { Strategy } from "passport-google-oauth2"
const GoogleStrategy: Strategy = require("passport-google-oauth2").Strategy

const app = express()

const sessionStore = new MySQLStore({}, DB.pool)

app.use((req, res, next) => {
    if (req.originalUrl.includes("assets") || req.originalUrl === "/favicon.ico") return next()
    NyLog.Log("connected page", {
        location: req.originalUrl,
        ip: req.ip
    })
    next()
})
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use("/assets", express.static(path.join(__dirname, "assets")))

app.get('/', (req, res) => {
    res.render("main")
})

app.listen(config.PORT, () => {
    NyLog.Success(`Express server launched on ${config.PORT}`)
})