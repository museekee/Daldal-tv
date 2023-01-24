import express from "express";
import fs from "fs"
import path from "path"
import config from "./../lib/config.json"
import multer from "multer"
import * as DB from "./../lib/db"
import yt from "./../lib/utils/youtube"

const router = express.Router()
const upload = multer()

router.use(express.json())

router.use(async (req, res, next) => {
    if (!req.user) return res.redirect("login")
    return next()
})

router.get("/", async (req, res) => {
    return res.render("upload")
})
router.post("/", upload.fields([{name: "video", maxCount: 1}, {name: "thumbnail", maxCount: 1}]), async (req, res) => {
    const uploadsPath = path.join(__dirname, "..", "uploads")
    const { title, description, visibility } = req.body
    // if (!req.body.video) return FuckYouGoBack("영상을 업로드 해주세요.")
    console.log(req.body)
    if (req.body.thumbnail === "undefined") return FuckYouGoBack("미리보기 이미지를 업로드 해주세요.")
    const vid = generateRandomString(10)
    if (title.length === 0 || title == "undefined") return FuckYouGoBack("제목을 입력해주세요.")
    if (!["public", "link", "private"].includes(visibility)) return FuckYouGoBack("공개 항목을 다시 확인해주세요.")
    if (!req.files) return FuckYouGoBack("파일 전송중 오류가 발생했습니다.")
    const files: {
        [x: string]: {
            fieldname: string
            originalname: string
            encoding: string
            mimetype: string
            buffer: Buffer
            size: number
        }[]
    } = req.files as any
    const video = files.video[0]
    const thumbnail = files.thumbnail[0]
    if (video.size > config.MAX_VIDEO_SIZE) return FuckYouGoBack("최대 영상 크기는 2GB입니다.")
    if (thumbnail.size > config.MAX_THUMBNAIL_SIZE) return FuckYouGoBack("최대 미리보기 이미지 크기는 10MB입니다.")
    if (!req.files) return FuckYouGoBack("파일 전송 중 오류가 발생했습니다.")
    if (!(await mkdir(path.join(uploadsPath, vid)))) return FuckYouGoBack("영상을 저장 중 오류가 발생했습니다.")
    if (video.mimetype !== "video/mp4") return FuckYouGoBack("mp4 영상만 업로드가 가능합니다.")
    if (thumbnail.mimetype !== "image/png") return FuckYouGoBack("png 미리보기 이미지만 업로드가 가능합니다.")
    if (!(await writeFile(path.join(uploadsPath, vid, "thumbnail.png"), thumbnail.buffer))) return FuckYouGoBack("영상을 저장 중 오류가 발생했습니다.")
    if (!(await writeFile(path.join(uploadsPath, vid, "video.mp4"), video.buffer))) return FuckYouGoBack("영상을 저장 중 오류가 발생했습니다.")
    await DB.addVideo({
        id: vid,
        title: title,
        description: description,
        visibility: visibility,
        provider: req.user!.id,
        type: "daldal-tv"
    })
    console.log("uploaded video", {
        id: vid,
        title: title,
        description: description,
        visibility: visibility,
        provider: req.user!.id
    })
    return res.send({ location: `/watch/${vid}` })
    function FuckYouGoBack(reason: string) {
        res.status(403).send({ reason: reason })
    }
    async function mkdir(path: string) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (e) => {
                if (e) reject(e)
                else resolve(true)
            })
        })
    }
    async function writeFile(path: string, buffer: Buffer) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, buffer, (e) => {
                if (e) reject(e)
                else resolve(true)
            })
        })
    }
})
router.get("/other", async (req, res) => {
    return res.render("upload_other", {
        other: await DB.getOtherVideoTypes()
    })
})
router.post("/other", async (req, res) => {
    const platform = req.body.platform
    const vid = req.body.vid
    let data = undefined
    if (platform === "youtube") {
        data = await yt(vid)
    }
    if (!data) return res.status(403).send({ reason: "Cannot find the video." })
    console.log(data)
    await DB.addVideo({
        id: data.id,
        title: data.title,
        description: data.description,
        visibility: "public",
        provider: req.user!.id,
        type: data.platform as "youtube" | "daldal-tv"
    })
})
function generateRandomString (num: number) {
    const characters ='1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export = router