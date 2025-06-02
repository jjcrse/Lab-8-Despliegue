class UploadBox extends HTMLElement {
  private message = "";
  private files: File[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderUI();
    this.setEventHandlers();
  }

  private setEventHandlers() {
    const form = this.shadowRoot!.querySelector<HTMLFormElement>("#upload-form");
    const fileInput = this.shadowRoot!.querySelector<HTMLInputElement>("#media-input");
    const previewArea = this.shadowRoot!.querySelector<HTMLDivElement>(".thumb-container");

    if (!form || !fileInput || !previewArea) return;

    fileInput.addEventListener("change", () => {
      const selected = Array.from(fileInput.files || []).filter(f => f.size > 0);
      this.files = selected;
      this.message = selected.length === 0 ? "Bro no haz subido nada" : "";
      this.updateMessage();
      this.showPreviews(this.files, previewArea);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (this.files.length === 0) {
        this.message = "Bro no haz subido nada";
        this.updateMessage();
        return;
      }

      try {
        for (const file of this.files) {
          console.log("Uploading to Supabase:", file.name);
          await new Promise((res) => setTimeout(res, 300));
        }

        this.dispatchEvent(new CustomEvent("media-added", {
          detail: { files: this.files },
          bubbles: true,
          composed: true,
        }));

        this.files = [];
        this.message = "";
        form.reset();
        previewArea.innerHTML = "";
        this.updateMessage();
      } catch (err) {
        console.error("Error al subir archivos:", err);
        this.message = "No se pudieron subir los archivos.";
        this.updateMessage();
      }
    });
  }

  private updateMessage() {
    const alertBox = this.shadowRoot!.querySelector(".alert");
    if (alertBox) {
      alertBox.textContent = this.message;
      alertBox.classList.toggle("hidden", this.message === "");
    }
  }

  private showPreviews(files: File[], area: HTMLElement) {
    area.innerHTML = "";

    files.forEach((file) => {
      const box = document.createElement("div");
      box.className = "mini-thumb";

      if (file.type.startsWith("image")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src);
        img.className = "preview-item";
        box.appendChild(img);
      } else if (file.type.startsWith("video")) {
        const vid = document.createElement("video");
        vid.src = URL.createObjectURL(file);
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.className = "preview-item";
        vid.onloadedmetadata = () => URL.revokeObjectURL(vid.src);
        box.appendChild(vid);
      }

      const remove = document.createElement("button");
      remove.className = "delete-thumb";
      remove.textContent = "×";
      remove.onclick = () => {
        this.files = this.files.filter(f => f !== file);
        box.remove();
      };

      box.appendChild(remove);
      area.appendChild(box);
    });
  }

  private renderUI() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          font-family: "Segoe UI", sans-serif;
          display: block;
          background: #1f1f2e;
          padding: 1rem;
          border-radius: 8px;
          color: #f9f9f9;
        }

        .header {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: #00d8ff;
        }

        .alert {
          background: #ff5050;
          padding: 0.8rem;
          border-radius: 4px;
          color: white;
          margin-bottom: 0.5rem;
        }

        .hidden {
          display: none;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        input[type="file"] {
          background: #2c2c3d;
          border: 1px solid #444;
          padding: 0.5rem;
          border-radius: 4px;
          color: #eee;
        }

        button[type="submit"] {
          background: #00d8ff;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          color: #101020;
        }

        .thumb-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.6rem;
          margin-top: 1rem;
        }

        .mini-thumb {
          position: relative;
          background: #292938;
          border-radius: 6px;
          overflow: hidden;
          aspect-ratio: 1/1;
        }

        .preview-item {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete-thumb {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255, 0, 0, 0.7);
          border: none;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.75rem;
          line-height: 1;
          cursor: pointer;
          display: none;
        }

        .mini-thumb:hover .delete-thumb {
          display: block;
        }
      </style>

      <div class="upload-wrapper">
        <div class="alert ${this.message ? "" : "hidden"}">${this.message}</div>
        <div class="header">Sube tu mejor meme</div>
        <form id="upload-form">
          <input id="media-input" name="media" type="file" accept="image/*,video/*" multiple />
          <div class="thumb-container"></div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    `;
  }
}


export default UploadBox;
