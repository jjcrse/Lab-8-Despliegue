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
          padding: 1.5rem;
          background: #121212;
          color: #f4f4f4;
          font-family: 'Segoe UI', sans-serif;
        }

        .warning {
          background: #d32f2f;
          color: #fff;
          padding: 1rem;
          border-radius: 8px;
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .meme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .nothing-here {
          text-align: center;
          padding: 2rem;
          background: #1e1e1e;
          border-radius: 10px;
          font-size: 1.1rem;
          color: #f0c674;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .nothing-here span {
          font-size: 2rem;
        }
      </style>

      ${this.fetchIssue
        ? `<div class="warning" role="alert">⚠️ Error al obtener los memes. Intenta más tarde.</div>`
        : ""
      }

      ${
        hasItems
          ? `<div class="meme-grid" id="memes-container"></div>`
          : `<div class="nothing-here"><span>🕸️</span> No hay memes aún. ¡Sé el primero en subir uno!</div>`
      }
    `;

    if (hasItems) {
      const grid = this.shadowRoot!.getElementById("memes-container");
      if (grid) {
        const fragment = document.createDocumentFragment();
        this.memeItems.forEach((meme) => {
          const item = document.createElement("meme-preview") as MemePreview;
          item.data = { url: meme.url, type: meme.type };
          fragment.appendChild(item);
        });
        grid.appendChild(fragment);
      }
    }
  }
}


export default MemeShowcase;
