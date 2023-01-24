const elems = {
    vloc: document.getElementById`videoLocation`,
    video: document.getElementById`video`,
    plf: document.getElementsByName`platform`,
    share: document.getElementById`share`
}
const $data = {
    vid: "",
    platform: "youtube",
    location: "https://youtube.com/embed/___ID___"
}
elems.vloc.addEventListener("change", () => {
    $data.vid = elems.vloc.value
    elems.video.setAttribute("src", $data.location.replace("___ID___", $data.vid))
})
for (const item of elems.plf)
    item.addEventListener("change", () => {
        $data.platform = document.querySelector("input[name=platform]:checked").value
        $data.platform = document.querySelector("input[name=platform]:checked").dataset.location
    })
elems.share.addEventListener("click", async () => {
    const res = await fetch("/upload/other", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            platform: $data.platform,
            vid: $data.vid
        })
    })
    if (res.status === 200) {
        console.log(res)
    }
    else if (res.status === 403) {
        swal({
            icon: "error",
            title: "오류!",
            text: (await res.json()).reason,
            button: "확인"
        })
    }
    else {
        swal({
            icon: "error",
            title: "오류!",
            text: `${res.status} ${res.statusText}`,
            button: "확인"
        })
    }
})