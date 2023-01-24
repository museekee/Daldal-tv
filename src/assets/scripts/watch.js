class DaldalComment extends HTMLElement {
    connectedCallback() {
        const nick = this.getAttribute("nick")
        const profilepic = this.getAttribute("profilePic")
        const content = this.getAttribute("content")
        const datetime = this.getAttribute("datetime")
        this.attachShadow({ mode: "open" })
        this.shadowRoot.append(document.getElementById("daldalComment").content.cloneNode(true))
        this.shadowRoot.getElementById("nick").innerText = nick
        this.shadowRoot.getElementById("profilePic").setAttribute("src", profilepic)
        this.shadowRoot.getElementById("content").innerText = content
        this.shadowRoot.getElementById("datetime").innerText = datetime
        this.removeAttribute("nick")
        this.removeAttribute("profilePic")
        this.removeAttribute("content")
        this.removeAttribute("datetime")
    }
}
customElements.define("daldal-comment", DaldalComment)
class DaldalVideo extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute("src")
        const title = this.getAttribute("title")
        const pf = this.getAttribute("profilepic")
        const author = this.getAttribute("author")
        const thumb = this.getAttribute("thumb")
        this.attachShadow({ mode: "open" })
        this.shadowRoot.append(document.getElementById("daldalVideo").content.cloneNode(true))
        this.shadowRoot.getElementById("thumbnail").style.background = `url(${thumb})`
        this.shadowRoot.getElementById("title").innerText = title
        this.shadowRoot.getElementById("profilePic").setAttribute("src", pf)
        this.shadowRoot.getElementById("author").innerText = author
        this.removeAttribute("title")
        this.removeAttribute("profilepic")
        this.removeAttribute("author")
        this.removeAttribute("src")
        this.removeAttribute("thumb")
        this.addEventListener("click", () => {
            window.location.href = `/watch/${id}`
        })
    }
}
customElements.define("daldal-video", DaldalVideo)
const elems = {
    vidinfo: {
        main: document.getElementById("video_information"),
        channel: {
            subscribe: document.getElementById("subscribe")
        },
        function: {
            like: document.getElementById("like"),
            dislike: document.getElementById("dislike"),
            share: document.getElementById("share"),
        }
    },
    comment: {
        main: document.getElementById("comments"),
        input: {
            text: document.getElementById("commentInput"),
            send: document.getElementById("send")
        },
        list: document.getElementById("commentList")
    },
    othvids: {
        main: document.getElementById("otherVideos"),
    }
}
const $data = {
    loadedComment: 0,
    loadCommentNum: 100,
    loadedVideo: 0,
    loadedVideoNum: 20
}
//#region 메뉴
for (const elem of document.getElementsByClassName("menu_select")) elem.addEventListener("click", () => {
    invisibleEvery()
    switch (elem.dataset.do) {
        case "vidinfo": {
            elems.vidinfo.main.setAttribute("class", "")
            break
        }
        case "comment": {
            elems.comment.main.setAttribute("class", "")
            break
        }
        case "othervid": {
            elems.othvids.main.setAttribute("class", "")
            break
        }
    }
})
function invisibleEvery() {
    elems.vidinfo.main.setAttribute("class", "invisibility")
    elems.comment.main.setAttribute("class", "invisibility")
    elems.othvids.main.setAttribute("class", "invisibility")
}
function copy(text) {
    // 임시의 textarea 생성
    const $textarea = document.createElement("textarea");
  
    // body 요소에 존재해야 복사가 진행됨
    document.body.appendChild($textarea);
    
    // 복사할 특정 텍스트를 임시의 textarea에 넣어주고 모두 셀렉션 상태
    $textarea.value = text;
    $textarea.select();
    
    // 복사 후 textarea 지우기
    document.execCommand('copy');
    document.body.removeChild($textarea);
}
//#endregion

//#region 영상정보
elems.vidinfo.function.share.addEventListener("click", async () => {
    const a = document.createElement("a")
    a.href = window.location.href
    a.innerText = window.location.href
    const result = await swal({
        icon: "info",
        title: "공유",
        content: a,
        buttons: {
            cancel: "취소",
            comfirm: {
                text: "복사하기",
                value: true
            }
        }
    })
    if (result) {
        copy(window.location.href)
    }
})
//#endregion
//#region 댓글
if (elems.comment.input.send)
    elems.comment.input.send.addEventListener("click", async () => {
        const res = await fetch("/videos/comment/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vid: vid,
                content: elems.comment.input.text.value
            })
        })
        const data = await res.json()
        if (res.status === 200) {
            console.log("성공")
            elems.comment.input.text.value = ""
        }
        else if (res.status === 403) {
            await swal({
                icon: "error",
                title: "오류!",
                text: data.reason,
                buttons: {
                    comfirm: "확인"
                }
            }) 
        }
        else {
            await swal({
                icon: "error",
                title: "오류!",
                text: "댓글을 등록하는 중, 모종의 오류가 발생하였습니다.",
                buttons: {
                    comfirm: "확인"
                }
            }) 
        }
    })
loadComments()
async function loadComments() {
    const res = await fetch(`/videos/comment/${vid}?start=${$data.loadedComment}&end=${$data.loadedComment+$data.loadCommentNum}`)
    if (res.status === 200) {
        const data = await res.json()
        console.log(data)
        $data.loadedComment += $data.loadCommentNum
        for (const item of data) {
            const daldalStar = document.createElement("daldal-comment")
            daldalStar.setAttribute("nick", item.nick)
            daldalStar.setAttribute("profilePic", item.profilePic)
            daldalStar.setAttribute("content", item.CONTENT)
            daldalStar.setAttribute("datetime", item.datetime)
            elems.comment.list.appendChild(daldalStar)
        }
    }
}
//#endregion

//#region 다른 동영상
loadVideos()
async function loadVideos() {
    const res = await fetch(`/videos/recommentvideo?start=${$data.loadedVideo}&end=${$data.loadedVideo+$data.loadedVideoNum}`)
    if (res.status === 200) {
        const data = await res.json()
        console.log(data)
        $data.loadedVideo += $data.loadedVideoNum
        for await (const item of data) {
            const daldalStar = document.createElement("daldal-video")
            daldalStar.setAttribute("src", item.ID)
            daldalStar.setAttribute("title", item.TITLE)
            daldalStar.setAttribute("profilepic", item.profilepic)
            daldalStar.setAttribute("author", item.author)
            daldalStar.setAttribute("thumb", item.thumbnailUrl)
            elems.othvids.main.appendChild(daldalStar)
        }
    }
}
//#endregion