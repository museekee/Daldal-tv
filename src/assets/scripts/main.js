class DaldalStar extends HTMLElement {
    connectedCallback() {
        const videoId = this.getAttribute("src")
        const thumb = this.getAttribute("thumb")
        const videoTitle = this.getAttribute("title")
        const rank = this.getAttribute("rank")
        this.attachShadow({ mode: "open" })
        this.shadowRoot.append(document.getElementById("daldalStar").content.cloneNode(true))
        this.shadowRoot.getElementById("title").innerText = videoTitle
        this.shadowRoot.getElementById("thumbnail").setAttribute("src", thumb)
        this.shadowRoot.getElementById("thumbnail").setAttribute("class", rank)
        this.shadowRoot.getElementById("container").setAttribute("href", `/watch/${videoId}`)
    }
}

customElements.define("daldal-star", DaldalStar)
const elems = {
    stars: document.getElementById("stars")
}
const $data = {
    loadedVideo: 0,
    loadVideoNum: 10
}

loadVideo()
async function loadVideo() {
    const res = await fetch(`/videos?start=${$data.loadedVideo}&end=${$data.loadedVideo+$data.loadVideoNum}`)
    if (res.status === 200) {
        const data = await res.json()
        console.log(data)
        $data.loadedVideo += $data.loadVideoNum
        for (const item of data) {
            const props = {
                thisSize: 0,
                thisRank: "bronze"
            }
            const daldalStar = document.createElement("daldal-star")
            daldalStar.setAttribute("src", item.ID)
            daldalStar.setAttribute("thumb", item.thumbnailUrl)
            daldalStar.setAttribute("title", item.TITLE)
            if (item.VIEWS < 10) props.thisSize += (item.VIEWS + 1) * 5 + 50
            else if (item.VIEWS < 150) props.thisSize += item.VIEWS
            else if (item.VIEWS < 250) props.thisSize += item.VIEWS * 0.75
            else if (item.VIEWS < 500) props.thisSize += item.VIEWS * 0.4
            else if (item.VIEWS <= 1750) props.thisSize += item.VIEWS ** 1.2 / Math.sqrt(item.VIEWS)
            else props.thisSize += 190
            if (item.VIEWS <= 20) props.thisRank = "bronze"
            else if (item.VIEWS <= 50) props.thisRank = "silver"
            else if (item.VIEWS <= 75) props.thisRank = "gold"
            else if (item.VIEWS <= 100) props.thisRank = "platinum"
            else if (item.VIEWS <= 130) props.thisRank = "diamond"
            else if (item.VIEWS <= 250) props.thisRank = "master"
            else props.thisRank = "grand_master"
            if (item.VIEWS >= 1000) props.thisRank = "challanger"
            daldalStar.style.width = `${props.thisSize}px`
            daldalStar.setAttribute("rank", props.thisRank)
            daldalStar.style.top = `${rand(0, 85)}%`
            daldalStar.style.left = `${rand(0, 85)}%`
            elems.stars.appendChild(daldalStar)
        }
    }
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}