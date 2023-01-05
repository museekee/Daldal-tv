import maria, { FieldPacket } from "mysql2/promise"
import config from "./../lib/config.json"
import { Google } from "./types/app"
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
export async function addUserByGoogleProfile(profile: Google) {
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
            ${conn.escape(`google-${profile.id}`)},
            ${conn.escape(profile.email)},
            ${conn.escape(profile.displayName)},
            ${conn.escape(profile.picture)}
        )
    `)
}