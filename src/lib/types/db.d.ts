import { FieldPacket, RowDataPacket } from "mysql2/promise"

declare namespace DB {
    interface User extends RowDataPacket {
        ID: string
        EMAIL: string
        NICK: string
        PROFILE_PIC: string?;
        ABOUT_ME: string
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
        TYPE: "daldal-tv" | "youtube"
    }
    interface Comments extends RowDataPacket {
        VID: string
        PROVIDER: string
        LIKES: number
        DISLIKES: number
        CONTENT: string
        TIME: Date
    }
    interface OtherVideos extends RowDataPacket {
        ID: string
        LOCATION: string
        THUMBNAIL: string
        NAME: string
    }
    interface Dislikes extends RowDataPacket {
        VID: string
        UID: string
    }
    interface Likes extends Dislikes {}
    interface Subscribes extends RowDataPacket {
        TARGET: string
        SUBSCRIBER: string
    }
}

export = DB