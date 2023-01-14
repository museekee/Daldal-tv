import maria, { FieldPacket } from "mysql2/promise"
import config from "./../lib/config.json"
import DB from "./types/db"

export const pool = maria.createPool({
    host: config.MARIA_HOST,
    user: config.MARIA_USER,
    password: config.MARIA_PASS,
    database: config.MARIA_DB,
})

//! #region User
export async function getUserById(id: string) {
    const conn = await pool.getConnection()
    const [rows]: [DB.User[], FieldPacket[]] = await conn.query(`SELECT * FROM users WHERE ID = ${conn.escape(id)};`)
    conn.release()
    return rows
}
export async function addUserByProfile(profile: {
    id: string
    email: string
    displayName: string
    picture: string
}) {
    const conn = await pool.getConnection()
    await conn.query(`
        INSERT INTO users
        (
            ID,
            EMAIL,
            NICK,
            PROFILE_PIC
        ) VALUES
        (
            ${conn.escape(profile.id)},
            ${conn.escape(profile.email)},
            ${conn.escape(profile.displayName)},
            ${conn.escape(profile.picture)}
        );
    `)
}
//#endregion
//! #region Video
export async function addVideo(data: {
    id: string
    title: string
    description: string
    visibility: string
    provider: string
}) {
    const conn = await pool.getConnection()    
    await conn.query(`
        INSERT INTO videos
        (
            ID,
            TITLE,
            DESCRIPTION,
            UPLOADED_AT,
            PROVIDER,
            VISIBILITY
        )
        VALUES (
            ${conn.escape(data.id)},
            ${conn.escape(data.title)},
            ${conn.escape(data.description !== "undefined" ? data.description : "")},
            NOW(),
            ${conn.escape(data.provider)},
            ${conn.escape(data.visibility)}
        );
    `)
    conn.release()
}
export async function getVideosById(vid: string, option?: {
    start: number,
    end: number,
    visibility: string
}) {
    const conn = await pool.getConnection()
    let WHERE = "WHERE " 
    WHERE += vid === "*" ? "" : `ID = ${conn.escape(vid)} `
    WHERE += !option ? "" : `VISIBILITY = ${conn.escape(option.visibility)} `
    if (WHERE === "WHERE ") WHERE = ""
    if (option) {
        const [rows]: [DB.Videos[], FieldPacket[]] = await conn.query(`SELECT * FROM videos ${WHERE} LIMIT ${option.start}, ${option.end};`)
        conn.release()
        return rows   
    }
    const [rows]: [DB.Videos[], FieldPacket[]] = await conn.query(`SELECT * FROM videos ${WHERE};`)
    conn.release()
    return rows
}
export async function updateVideo(vid: string, data: Omit<DB.Videos, "UPLOADED_AT">) {
    const conn = await pool.getConnection()
    const [videos]: [DB.Videos[], FieldPacket[]] = (await conn.query(`SELECT * FROM videos WHERE ID = ${conn.escape(vid)}`))
    const video = videos[0]
    data.TITLE ??= video.TITLE
    data.DESCRIPTION ??= video.DESCRIPTION
    data.PROVIDER ??= video.PROVIDER
    data.VIEWS ??= 0
    data.LIKES ??= 0
    data.DISLIKES ??= 0
    data.VISIBILITY ??= video.VISIBILITY
    await conn.query(`
        UPDATE videos
        SET
            TITLE = ${conn.escape(data.TITLE)},
            DESCRIPTION = ${conn.escape(data.DESCRIPTION)},
            PROVIDER = ${conn.escape(data.PROVIDER)},
            VIEWS = VIEWS + ${conn.escape(data.VIEWS)},
            LIKES = LIKES + ${conn.escape(data.LIKES)},
            DISLIKES = DISLIKES + ${conn.escape(data.DISLIKES)},
            VISIBILITY = ${conn.escape(data.VISIBILITY)}
        WHERE 
            ID = ${conn.escape(video.ID)};
    `)
    conn.release()
}
//#endregion
//! #region Comment
export async function addComment(data: {
    vid: string,
    provier: string
    content: string
}) {
    const conn = await pool.getConnection()    
    await conn.query(`
        INSERT INTO comments
        (
            VID,
            PROVIDER,
            CONTENT,
            TIME
        )
        VALUES (
            ${conn.escape(data.vid)},
            ${conn.escape(data.provier)},
            ${conn.escape(data.content)},
            NOW()
        );
    `)
    conn.release()
}
export async function getCommentsById(vid: string, option?: {
    start: number,
    end: number
}) {
    const LIMIT = option ? `LIMIT ${option.start}, ${option.end}` : ""
    const conn = await pool.getConnection()
    const [rows]: [DB.Comments[], FieldPacket[]] = await conn.query(`SELECT * FROM comments WHERE VID = ${conn.escape(vid)} ${LIMIT};`)
    conn.release()
    return rows
}
//#endregion