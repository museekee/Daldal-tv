import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import fs from "fs"
import * as NyLog from "./../lib/NyLog"
import DBType from "../lib/types/db"

const router = express.Router()

router.get("/", async (req, res) => {
    console.debug(req.query)
    if (!req.query.start || !req.query.end) return res.sendStatus(403);
    const start = parseInt(req.query.start.toString())
    const end = parseInt(req.query.end.toString())
    if (typeof start !== "number" || typeof end !== "number") return res.sendStatus(403);
    const videos = await DB.getVideosById("*", {
        start: start,
        end: end,
        visibility: "public"
    })
    return res.send(videos)
})
router.get("/getthumbnail/:vid", async (req, res) => {
    const thumbnailPath = path.join(__dirname, "..", "uploads", req.params.vid, "thumbnail.png")
    return res.sendFile(thumbnailPath)
})
export = router