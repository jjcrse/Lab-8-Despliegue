class MemePortalRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          background-color: #111;
          color: #eee;
          min-height: 100vh;
          padding: 1rem;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #00d8ff;
        }

        nav a {
          margin-left: 1rem;
          color: #ccc;
          text-decoration: none;
          font-weight: 500;
        }

        nav a:hover {
          color: #00d8ff;
        }

        main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      </style>

      <header>
        <h1>MemeWall</h1>
        <nav>
          <a href="#home">Inicio</a>
          
        </nav>
      </header>

      <main id="main-content"></main>
    `;

    window.addEventListener("hashchange", this.updateView.bind(this));
    this.updateView(); // Inicializa con la vista actual
  }

  private updateView() {
    const route = window.location.hash.slice(1) || "home";
    const container = this.shadowRoot!.querySelector("#main-content")!;
    container.innerHTML = "";

    switch (route) {
      case "upload":
        container.appendChild(document.createElement("upload-box"));
        break;
      case "home":
      default:
        const home = document.createElement("home-panel");
        container.appendChild(home);
        break;
    }
  }
}


export default MemePortalRoot;
