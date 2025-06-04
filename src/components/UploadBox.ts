import { uploadMeme } from "../services/Supabase/StoreService";

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
        const uploadedFiles = [];

        for (const file of this.files) {
          const meme = await uploadMeme(file);
          if (meme) uploadedFiles.push(meme);
        }

        this.dispatchEvent(new CustomEvent("media-added", {
          detail: { files: uploadedFiles },
          bubbles: true,
          composed: true,
        }));

        this.files = [];
        this.message = "";
        form.reset();
        previewArea.innerHTML = "";
        this.updateMessage();
      } catch (err) {
        const errorMessage = (err as Error)?.message || "Error desconocido";
        console.error("Error al subir archivos:", errorMessage);
        this.message = `No se pudieron subir los archivos: ${errorMessage}`;
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
        /* tu CSS actual aquí (lo dejé igual) */
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
