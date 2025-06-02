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
      const isVid = type.includes("video");
  
      this.shadowRoot.innerHTML = `
        <style>
          .wrapper {
            background: #141414;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.25);
            transition: scale 0.3s ease;
          }
  
          .wrapper:hover {
            scale: 1.02;
          }
  
          .media {
            width: 100%;
            height: auto;
            display: block;
          }
  
          .vid {
            object-fit: cover;
          }
  
          .media-container {
            position: relative;
            aspect-ratio: 4/3;
            background-color: #000;
          }
        </style>
  
        <div class="wrapper">
          <div class="media-container">
            ${
              isVid
                ? `<video src="${url}" class="media vid" autoplay muted loop></video>`
                : `<img src="${url}" class="media" alt="Meme" />`
            }
          </div>
        </div>
      `;
    }
  }
  

  export default MemePreview;
  