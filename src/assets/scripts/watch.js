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
    },
    othvids: {
        main: document.getElementById("otherVideos"),
    }
}
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
