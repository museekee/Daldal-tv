const elems = {
    vidinfo: document.getElementById("video_information"),
    comment: document.getElementById("comments"),
    othvids: document.getElementById("otherVideos")
}
for (const elem of document.getElementsByClassName("menu_select")) elem.addEventListener("click", () => {
    invisibleEvery()
    switch (elem.dataset.do) {
        case "vidinfo": {
            elems.vidinfo.setAttribute("class", "")
            break
        }
        case "comment": {
            elems.comment.setAttribute("class", "")
            break
        }
        case "othervid": {
            elems.othvids.setAttribute("class", "")
            break
        }
    }
})
function invisibleEvery() {
    elems.vidinfo.setAttribute("class", "invisibility")
    elems.comment.setAttribute("class", "invisibility")
    elems.othvids.setAttribute("class", "invisibility")
}