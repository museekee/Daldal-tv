import { FieldPacket, RowDataPacket } from "mysql2/promise"

declare namespace DB {
    interface User extends RowDataPacket {
        ID: string
        EMAIL: string
        NICK: string
        PROFILE_PIC: string?;
        ABOUT_ME: string
        VIDEOS: string
        SUBSCRIBERS: number
        SUBSCRIBING: string
    }
    interface Videos extends RowDataPacket {
        ID: string
        TITLE: string
        DESCRIPTION: string
        UPLOADED_AT: Date
        PROVIDER: string
        VIEWS: number
        LIKES: number
        DISLIKES: number
        VISIBILITY: "public" | "link" | "private"
    }
    interface Comments extends RowDataPacket {
        VID: string
        PROVIDER: string
        LIKES: number
        DISLIKES: number
        CONTENT: string
        TIME: Date
    }
}

export = DB