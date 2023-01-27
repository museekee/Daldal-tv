import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import fs from "fs"
import * as NyLog from "./../lib/NyLog"
import DBType from "../lib/types/db"

const router = express.Router()

router.get("/:cid", async (req, res) => {
    try {
        const user = await DB.getUserById(req.params.cid)
        return res.render("channel", {
            channel: {
                id: user.ID,
                nick: user.NICK,
                pic: user.PROFILE_PIC,
                about: user.ABOUT_ME,
                subs: user.SUBSCRIBERS,
                subsing: user.SUBSCRIBING,
                videoLen: (await DB.getVideosById("*", {
                    start: 0,
                    end: 99999999999,
                    visibility: "public",
                    who: user.ID
                })).length
            }
        })
    }
    catch {
        return res.sendStatus(404)
    }
})

export = router