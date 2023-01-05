class DaldalStar extends HTMLElement {
    connectedCallback() {
        const videoId = this.getAttribute("src")
        this.attachShadow({ mode: "open" })
        this.shadowRoot.append(document.getElementById("daldalStar").content.cloneNode(true))
        this.shadowRoot.getElementById("title").innerText = videoId
        this.shadowRoot.getElementById("thumbnail").setAttribute("src", `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
        this.shadowRoot.getElementById("container").setAttribute("href", `https://www.youtube.com/watch?v=${videoId}`)
    }
}

customElements.define("daldal-star", DaldalStar)