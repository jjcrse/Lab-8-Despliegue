class MemePreview extends HTMLElement {
  private mediaInfo: { url: string; type: string } | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(info: { url: string; type: string }) {
    this.mediaInfo = info;
    this.display();
  }

  private display() {
    if (!this.shadowRoot || !this.mediaInfo) return;

    const { url, type } = this.mediaInfo;
    const isVideo = type.includes("video");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 100%;
          font-family: sans-serif;
        }

        .wrapper {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .media-container {
          position: relative;
          aspect-ratio: 4 / 3;
          background-color: #000;
        }

        .media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        video.media {
          border: none;
        }
      </style>

      <div class="wrapper" aria-label="Vista previa de meme">
        <div class="media-container">
          ${
            isVideo
              ? `<video src="${url}" class="media" autoplay muted loop playsinline></video>`
              : `<img src="${url}" class="media" alt="Vista previa del meme" loading="lazy" />`
          }
        </div>
      </div>
    `;
  }
}


export default MemePreview;
