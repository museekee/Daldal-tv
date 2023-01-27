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