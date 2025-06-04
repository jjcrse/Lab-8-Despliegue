import MemeShowcase from "../components/MemeShowcase";
import { Meme } from "../services/Supabase/StoreService";

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

    // Esperar al próximo tick para que los elementos estén disponibles en el DOM
    requestAnimationFrame(() => {
      this.showcaseRef = this.shadowRoot!.querySelector("meme-showcase") as MemeShowcase | null;
      const uploader = this.shadowRoot!.querySelector("upload-box");

      if (uploader && this.showcaseRef) {
        uploader.addEventListener("media-added", (event: Event) => {
          const detail = (event as CustomEvent).detail;
          const newMemes: Meme[] = detail?.files || [];

          newMemes.forEach((meme) => {
            this.showcaseRef!.addMeme(meme);
          });
        });
      }
    });
  }
}

export default HomePanel;
