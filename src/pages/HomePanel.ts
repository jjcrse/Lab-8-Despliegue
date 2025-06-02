import MemeShowcase from "../components/MemeShowcase";

class HomePanel extends HTMLElement {
  private showcaseRef: MemeShowcase | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <section>
        <meme-showcase></meme-showcase>
        <upload-box></upload-box>
      </section>
    `;

    // Cast explícito para que reconozca el método addMeme()
    this.showcaseRef = this.shadowRoot!.querySelector("meme-showcase") as MemeShowcase;
    const uploader = this.shadowRoot!.querySelector("upload-box");

    if (uploader) {
      uploader.addEventListener("media-added", (event: Event) => {
        const detail = (event as CustomEvent).detail;
        if (detail?.files && this.showcaseRef) {
          detail.files.forEach((file: File) => {
            const type = file.type;
            const url = URL.createObjectURL(file); // TEMP URL para mostrar inmediatamente
            this.showcaseRef!.addMeme({ url, type }); // ✅ ahora sí funciona
          });
        }
      });
    }
  }
}


export default HomePanel;
