import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import * as NyLog from "./../lib/NyLog"
import DBType from "../lib/types/db"
import { Temporal } from "@js-temporal/polyfill"

const router = express.Router()
router.use(express.json())

router.get("/", async (req, res) => {
    if (!req.query.start || !req.query.end) return res.sendStatus(403)
    const start = parseInt(req.query.start.toString())
    const end = parseInt(req.query.end.toString())
    if (typeof start !== "number" || typeof end !== "number") return res.sendStatus(403)
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
router.post("/comment/add", async (req, res) => {
    const content: string = req.body.content
    const vid: string = req.body.vid
    if (vid == undefined || content == undefined) return res.status(500)
    if (!req.user) return res.status(403).send({
        reason: "로그인을 해주세요"
    })
    if (content.length > 1000) return res.status(403).send({
        reason: `최대 1000자까지 작성할 수 있습니다.\n글자 수 : ${content.length}/1000`
    })
    await DB.addComment({
        provier: req.user.id,
        vid: vid,
        content: content
    })
    return res.status(200).send({reason: "success"})
})
router.get("/comment/:vid", async (req, res) => {
    if (!req.query.start || !req.query.end) return res.sendStatus(403)
    const start = parseInt(req.query.start.toString())
    const end = parseInt(req.query.end.toString())
    if (typeof start !== "number" || typeof end !== "number") return res.sendStatus(403)
    const comments: DBType.Comments[] = await DB.getCommentsById(req.params.vid, {
        start: start,
        end: end
    })
    const newComments = await Promise.all(comments.map(async (item) => {
        const user = (await DB.getUserById(item.PROVIDER))[0]
        if (!user) {
            item.profilePic = "/assets/images/Anonymous.png"
            item.nick = "알 수 없음"
        }
        else {
            item.profilePic = user.PROFILE_PIC
            item.nick = user.NICK
        }
        const Dday = Temporal.PlainDateTime.from(item.TIME.toISOString().substring(0, item.TIME.toISOString().length - 5))
        const today = Temporal.Now.plainDateTimeISO()
        const result = Dday.since(today)
        if (result.days === 0) item.datetime = "오늘"
        else if (result.days === -1) item.datetime = "어제"
        else if (result.days === -2) item.datetime = "그제"
        else if (result.days === -3) item.datetime = "그끄저께"
        else if (result.days <= -30) item.datetime = `${-result.days}일 전`
        else if (result.days <= -365) {
            console.log(Math.floor(result.days / -30))
            item.datetime = `${Math.floor(result.days / -30)}개월 전`
        }
        else item.datetime = `${Math.floor(result.days / -365)}년 전`
        return item
    }))
    return res.send(newComments)
})
router.get("/recommentvideo", async (req, res) => {
    if (!req.query.start || !req.query.end) return res.sendStatus(403)
    const start = parseInt(req.query.start.toString())
    const end = parseInt(req.query.end.toString())
    if (typeof start !== "number" || typeof end !== "number") return res.sendStatus(403)
    return res.send(await DB.getVideoOrderByChobo({
        start: start,
        end: end
    }))
})
export = router