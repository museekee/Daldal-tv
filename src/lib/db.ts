import maria, { FieldPacket } from "mysql2/promise"
import config from "./../lib/config.json"

export const pool = maria.createPool({
    host: config.MARIA_HOST,
    user: config.MARIA_USER,
    password: config.MARIA_PASS,
    database: config.MARIA_DB,
})