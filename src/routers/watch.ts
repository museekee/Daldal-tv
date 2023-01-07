import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import fs from "fs"
import * as NyLog from "./../lib/NyLog"

const router = express.Router()

router.get("/:vid", (req, res) => {
    return res.render("watch", {
        stream: `/watch/stream/${req.params.vid}`
    })
})

router.get("/stream/:vid", async (req, res) => {
    const video = path.join(__dirname, "..", "uploads", req.params.vid, "video.mp4")
    if (!fs.existsSync(video)) return res.sendStatus(404)
    const range = req.headers.range
    if (!range) return res.status(400).send("Requires Range header")
    const videoSize = fs.statSync(video).size
    const CHUNK_SIZE = 20 ** 6 
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    }
    res.writeHead(206, headers);

    fs.createReadStream(video, {start, end}).pipe(res)
    // const stream = fs.createReadStream(path.join(__dirname, "..", "uploads", req.params.vid, "video.mp4"))
    // let count = 0
    // stream.on("data", data => {
    //     count++
    //     console.log("data count : ", count)
    //     res.write(data)
    // })
    // stream.on("end", () => {
    //     console.log("streaming end")
    //     res.end()
    // })
    // stream.on('error', function(e) {
    //     NyLog.Error(e.message, { stack: e.stack });
    //     res.end('500 Internal Server '+e);
    // })
})
export = router