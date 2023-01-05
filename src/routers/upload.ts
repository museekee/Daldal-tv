import express, { application } from "express";

const router = express.Router()

router.use(async (req, res, next) => {
    if (!req.session.passport) return res.sendStatus(403)
    return next()
})

router.get("/", async (req, res) => {
    return res.render("upload")
})

export = router