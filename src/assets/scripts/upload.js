const elems = {
    uploadBox: document.getElementById("uploadBox"),
    videoFile: document.getElementById("videoFile"),
    uploadBtn: document.getElementById("uploadBtn"),
}
elems.uploadBtn.addEventListener("click", () => elems.videoFile.click())
elems.videoFile.addEventListener("change", (e) => {
    const file = elems.videoFile.files[0]
    elems.uploadBox.setAttribute("class", "")
    elems.uploadBtn.remove()
    console.log(file)
})