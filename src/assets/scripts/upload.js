document.getElementById("uploadBox").addEventListener("click", () => document.getElementById("videoFile").click())
document.getElementById("videoFile").addEventListener("change", (e) => {
    const file = document.getElementById("videoFile").files[0]
    console.log(file)
})