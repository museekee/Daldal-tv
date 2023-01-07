import { FieldPacket, RowDataPacket } from "mysql2/promise"

declare namespace DB {
    interface User extends RowDataPacket {
        ID: string;
        EMAIL: string;
        NICK: string;
        PROFILE_PIC: string?;
        ABOUT_ME: string;
        VIDEOS: string;
    }
    interface Videos extends RowDataPacket {
        ID: string
        TITLE: string
        DESCRIPTION: string
        UPLOADED_AT: any
        PROVIDER: string
        VIEWS: number
        LIKES: number
        DISLIKES: number
        VISIBILITY: "public" | "link" | "private"
    }
}

export = DB