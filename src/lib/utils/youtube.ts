import { Client } from "youtubei"

const youtube = new Client()

export default async function video(vid: string) {
    const data = await youtube.getVideo(vid)
    if (!data) throw new Error("Cannot find the video.")
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        platform: "youtube"   
    }
}