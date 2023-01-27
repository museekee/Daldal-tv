import express from "express"
import * as DB from "./../lib/db"
import path from "path"
import fs from "fs"
import * as NyLog from "./../lib/NyLog"
import DBType from "../lib/types/db"

const router = express.Router()

router.get("/:cid", async (req, res) => {
    const user = await DB.getUserById(req.params.cid)
    res.render("channel", {
        
    })
})

export = router