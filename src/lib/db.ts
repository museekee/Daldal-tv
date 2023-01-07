import maria, { FieldPacket } from "mysql2/promise"
import config from "./../lib/config.json"
import DB from "./types/db"

export const pool = maria.createPool({
    host: config.MARIA_HOST,
    user: config.MARIA_USER,
    password: config.MARIA_PASS,
    database: config.MARIA_DB,
})

export async function getUserById(id: string) {
    const conn = await pool.getConnection()
    const [rows]: [DB.User[], FieldPacket[]] = await conn.query(`SELECT * FROM users WHERE ID = ${conn.escape(id)}`)
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
        )
        VALUES
        (
            ${conn.escape(profile.id)},
            ${conn.escape(profile.email)},
            ${conn.escape(profile.displayName)},
            ${conn.escape(profile.picture)}
        )
    `)
}

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
        VALUES
        (
            ${conn.escape(data.id)},
            ${conn.escape(data.title)},
            ${conn.escape(data.description !== "undefined" ? data.description : "")},
            NOW(),
            ${conn.escape(data.provider)},
            ${conn.escape(data.visibility)}
        )
    `)
}
export async function getVideosById(vid: string) {
    const conn = await pool.getConnection()
    const [rows]: [DB.Videos[], FieldPacket[]] = await conn.query(`SELECT * FROM videos WHERE ID = ${conn.escape(vid)}`)
    return rows
}