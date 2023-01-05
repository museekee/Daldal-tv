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
}

export = DB