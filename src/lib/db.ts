import maria, { FieldPacket } from "mysql2/promise"
import config from "./../lib/config.json"
import DB from "./types/db"

export const pool = maria.createPool({
    host: config.MARIA_HOST,
    user: config.MARIA_USER,
    password: config.MARIA_PASS,
    database: config.MARIA_DB,
})

// #region User
export async function getUserById(id: string) {
    const conn = await pool.getConnection()
    const [rows]: [DB.User[], FieldPacket[]] = await conn.query(`SELECT * FROM users WHERE ID = ${conn.escape(id)};`)
    conn.release()
    if (rows.length === 0) throw new Error("Cannot find user")
    return rows[0]
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
export async function subscribe(subject: string, indirectObject: string) {
    const S = await getUserById(subject)
    const IO = await getUserById(indirectObject)
    const IOSubscribers = JSON.parse(IO.SUBSCRIBERS)
    const SSubscribing = JSON.parse(S.SUBSCRIBING)
    if (IOSubscribers.includes(S.ID)) { //! true시 구독중
        //! 구독 당했던 채널의 구독자 명단서 삭제
        const conn = await pool.getConnection()
        await conn.query(`
            UPDATE users
            SET
                SUBSCRIBERS = ${conn.escape(JSON.stringify(IOSubscribers.filter((element: string) => element !== S.ID)))}
            WHERE
                ID = ${conn.escape(IO.ID)}
        `)
        //! 구독 한 사람의 구독 목록서 삭제
        await conn.query(`
            UPDATE users
            SET
                SUBSCRIBING = ${conn.escape(JSON.stringify(SSubscribing.filter((element: string) => element !== IO.ID)))}
            WHERE
                ID = ${conn.escape(S.ID)}
        `)
        conn.release()
        return 0
    }
    else { //! false니 구독 안 한 상태
        const conn = await pool.getConnection()
        IOSubscribers.push(S.ID)
        console.log(IOSubscribers)
        //! 구독 당하는 사람의 구독자 명단에 추가
        await conn.query(`
            UPDATE users
            SET
                SUBSCRIBERS = ${conn.escape(JSON.stringify(IOSubscribers))}
            WHERE
                ID = ${conn.escape(IO.ID)}
        `)
        //! 구독 할 사람의 구독 목록에 추가
        SSubscribing.push(IO.ID)
        await conn.query(`
            UPDATE users
            SET
                SUBSCRIBING = ${conn.escape(JSON.stringify(SSubscribing))}
            WHERE
                ID = ${conn.escape(S.ID)}
        `)
        conn.release()
        return 1
    }
}
//#endregion
// #region Video
export async function addVideo(data: {
    id: string
    title: string
    description: string
    visibility: string
    provider: string,
    type: "daldal-tv" | "youtube"
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
            VISIBILITY,
            TYPE
        )
        VALUES (
            ${conn.escape(data.id)},
            ${conn.escape(data.title)},
            ${conn.escape(data.description !== "undefined" ? data.description : "")},
            NOW(),
            ${conn.escape(data.provider)},
            ${conn.escape(data.visibility)},
            ${conn.escape(data.type)}
        );
    `)
    conn.release()
}
export async function getVideosById(vid: string, option?: {
    start: number,
    end: number,
    visibility: string,
    who?: string
}) {
    const conn = await pool.getConnection()
    let WHERE = "WHERE " 
    WHERE += vid === "*" ? "" : `ID = ${conn.escape(vid)} `
    WHERE += !option ? "" : `VISIBILITY = ${conn.escape(option.visibility)} `
    WHERE += option?.who ? `AND PROVIDER = ${conn.escape(option.who)}` : ""
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
export async function getVideoOrderByChobo(option: {
    start: number
    end: number
}) {
    const conn = await pool.getConnection()
    const [videos]: [DB.Videos[], FieldPacket[]] = await conn.query(`
        SELECT * FROM videos
        WHERE VISIBILITY = 'public'
        ORDER BY
            'VIEWS' ASC,
            'LIKES' ASC,
            'DISLIKES' DESC,
            'UPLOADED_AT' ASC
        LIMIT ${option.start}, ${option.end};
    `)
    conn.release()
    return videos
}
//#endregion
// #region Comment
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
    const [rows]: [DB.Comments[], FieldPacket[]] = await conn.query(`SELECT * FROM comments WHERE VID = ${conn.escape(vid)} ORDER BY TIME DESC ${LIMIT};`)
    conn.release()
    return rows
}
//#endregion
// #region OtherVideo
export async function getOtherVideoTypes(type?: string) {
    const conn = await pool.getConnection()
    if (!type) {
        const [rows]: [DB.OtherVideos[], FieldPacket[]] = await conn.query("SELECT * FROM other_videos;")
        conn.release()
        return rows
    }
    else {
        const [rows]: [DB.OtherVideos[], FieldPacket[]] = await conn.query(`SELECT * FROM other_videos WHERE ID = ${conn.escape(type)};`)
        conn.release()
        return rows
    }
}
//#endregion