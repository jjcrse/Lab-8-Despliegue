import MemePreview from "./MemePreview";
import { getMemes, Meme } from "../services/Supabase/StoreService";

class MemeShowcase extends HTMLElement {
  private memeItems: Meme[] = [];
  private fetchIssue = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.loadContent();
    this.displayContent();
  }

  public addMeme(newMeme: Meme) {
    this.memeItems.unshift(newMeme);
    this.displayContent();
  }

  private async loadContent() {
    try {
      this.memeItems = await getMemes();
    } catch (e) {
      console.warn("Error cargando memes:", e);
      this.fetchIssue = true;
    }
  }

  private displayContent() {
    if (!this.shadowRoot) return;

    const hasItems = this.memeItems.length > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          padding: 1rem;
          color: #fafafa;
        }

        .warning {
          background: crimson;
          padding: 1rem;
          border-radius: 6px;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .meme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.2rem;
        }

        .nothing-here {
          text-align: center;
          padding: 2rem;
          background: #2e2e2e;
          border-radius: 8px;
          color: #f0c674;
        }
      </style>

      ${this.fetchIssue
        ? `<div class="warning">Hubo un problema al obtener los memes. Intenta más tarde.</div>`
        : ""
      }

      ${
        hasItems
          ? `<div class="meme-grid" id="memes-container"></div>`
          : `<div class="nothing-here">No se han subido memes aún. Sé el primero en compartir uno 🎉</div>`
      }
    `;

    if (hasItems) {
      const grid = this.shadowRoot!.getElementById("memes-container");
      if (grid) {
        this.memeItems.forEach((meme) => {
          const item = document.createElement("meme-preview") as MemePreview;
          item.data = { url: meme.url, type: meme.type };
          grid.appendChild(item);
        });
      }
    }
  }
}

export default MemeShowcase;
