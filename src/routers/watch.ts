import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import fs from "fs"
import * as NyLog from "./../lib/NyLog"
import DBType from "../lib/types/db"

const router = express.Router()

router.get("/:vid", async (req, res) => {
    const videos: DBType.Videos[] = await DB.getVideosById(req.params.vid)
    if (videos.length === 0) return res.status(404).send("없는 동영상입니다.")
    const video = videos[0]
    if (video.VISIBILITY === "private" && video.PROVIDER !== req.user?.id) return res.status(403).send("비공개 동영상입니다.")
    const provider = (await DB.getUserById(video.PROVIDER))[0]
    const senddata = {
        stream: "",
        video: {
            id: video.ID,
            title: video.TITLE,
            description: video.DESCRIPTION.replace("\n", "<br/>"),
            uploaded_at: new Intl.DateTimeFormat("ko", { dateStyle: 'medium' }).format(video.UPLOADED_AT),
            views: video.VIEWS,
            likes: video.LIKES,
            dislikes: video.DISLIKES
        },
        provider: {
            name: provider.NICK,
            picture: provider.PROFILE_PIC,
            subs: provider.SUBSCRIBERS
        },
        my: {}
    }
    if (video.TYPE === "daldal-tv") senddata.stream = `/watch/stream/${req.params.vid}`
    await DB.updateVideo(video.ID, {
        VIEWS: 1
    })
    if (req.user) {
        const user = (await DB.getUserById(req.user.id))[0]
        senddata.my = {
            picture: user.PROFILE_PIC
        }
    }
    return res.render("watch", senddata)
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