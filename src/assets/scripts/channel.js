const elems = {
    videos: document.getElementById("section-videos").getElementsByClassName("body")[0],
    subscribe: document.getElementById("subs")
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
elems.subscribe.addEventListener("click", async () => {
    const res = await fetch(`/videos/${cid}/subscribe`, {
        method: "POST"
    })
    if (res.status === 200) {
        const data = await res.json()   
        if (data.code === 0) {
            elems.subscribe.innerHTML = `<span class="icon fa-fw fas fa-heart"></span>${parseInt(elems.subscribe.innerText.replace(/[^0-9]/g, ""))-1}`

        }
        if (data.code === 1) {
            elems.subscribe.innerHTML = `<span class="icon fa-fw fas fa-heart"></span>${parseInt(elems.subscribe.innerText.replace(/[^0-9]/g, ""))+1}<label class="desc">&nbsp;성원중</label>`

        }
    }
    else {
        await swal({
            icon: "error",
            title: "성원",
            text: "성원에 실패했습니다."
        })
    }
})