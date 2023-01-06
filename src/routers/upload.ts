import express from "express";

const router = express.Router()

router.use(async (req, res, next) => {
    if (!req.user) return res.redirect("login")
    return next()
})

router.get("/", async (req, res) => {
    return res.render("upload")
})

export = router