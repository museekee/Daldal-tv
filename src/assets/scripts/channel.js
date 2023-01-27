const elems = {
    videos: document.getElementById("section-videos").getElementsByClassName("body")[0]
}
const $data = {
    loadedVideo: 0,
    loadVideoNum: 10
}

loadVideos()
async function loadVideos() {
    const res = await fetch(`/videos/${cid}?start=${$data.loadedVideo}&end=${$data.loadedVideo+$data.loadVideoNum}`)
    if (res.status === 200) {
        const data = await res.json()
        console.log(data)
        $data.loadedVideo += $data.loadVideoNum
        for await (const item of data) {
            const daldalStar = document.createElement("daldal-video")
            daldalStar.setAttribute("src", item.ID)
            daldalStar.setAttribute("title", item.TITLE)
            daldalStar.setAttribute("profilepic", "")
            daldalStar.setAttribute("author", `조회수 ${item.VIEWS}회`)
            daldalStar.setAttribute("thumb", item.thumbnailUrl)
            elems.videos.appendChild(daldalStar)
        }
    }
}