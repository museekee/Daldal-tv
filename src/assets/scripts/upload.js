const elems = {
    uploadBox: document.getElementById("uploadBox"),
    videoFile: document.getElementById("videoFile"),
    uploadBtn: document.getElementById("uploadBtn"),
    otherUpload: document.getElementById("otherUpload"),
    uploadData: {
        main: document.getElementById("uploadData"),
        title: document.getElementById("titleInput"),
        description: document.getElementById("descriptionInput"),
        visibility: document.getElementById("selectVisibility"),
        thumbnail: document.getElementById("thumbnailInput"),
        thumbnailForm: document.getElementById("imageFile"),
        preVideo: document.getElementById("preVideo"),
        upload: document.getElementById("upload")
    }
}
const uploadData = {
    video: undefined,
    thumbnail: undefined,
    title: undefined,
    description: undefined,
    visibility: "public",
}
elems.uploadBtn.addEventListener("click", () => elems.videoFile.click())
elems.videoFile.addEventListener("change", () => {
    const file = elems.videoFile.files[0]
    elems.uploadBox.setAttribute("class", "")
    elems.uploadBtn.remove()
    elems.otherUpload.remove()
    elems.uploadData.main.setAttribute("class", "")
    uploadData.video = file
    elems.uploadData.preVideo.setAttribute("src", URL.createObjectURL(file)) 
    console.log(uploadData)
})

elems.uploadData.thumbnail.addEventListener("click", () => elems.uploadData.thumbnailForm.click())
elems.uploadData.thumbnailForm.addEventListener("change", () => {
    const file = elems.uploadData.thumbnailForm.files[0]
    if (!file) return
    uploadData.thumbnail = file
    elems.uploadData.thumbnail.setAttribute("src", URL.createObjectURL(file))
    console.log(uploadData)
})

elems.uploadData.title.addEventListener("change", () => uploadData.title = elems.uploadData.title.value)
elems.uploadData.description.addEventListener("change", () => uploadData.description = elems.uploadData.description.value)
elems.uploadData.visibility.addEventListener("change", () => uploadData.visibility = document.querySelector('input[name="visibility"]:checked').value)


//! Upload
elems.uploadData.upload.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("video", uploadData.video)
    formData.append("thumbnail", uploadData.thumbnail)
    formData.append("title", uploadData.title)
    formData.append("description", uploadData.description)
    formData.append("visibility", uploadData.visibility)

    const res = await fetch('/upload', {
        method: 'POST',
        body: formData
    })
    if (res.status === 403) {
        swal({
            icon: "error",
            title: "오류!",
            text: (await res.json()).reason,
            button: "확인"
        })
    }
    else if (res.status === 200) {
        window.location.href = ((await res.json()).location)
    }
    else {
        swal({
            icon: "error",
            title: "오류!",
            text: res.statusText,
            button: "확인"
        }) 
    }
})