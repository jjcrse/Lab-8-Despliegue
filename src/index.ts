import MemePreview from "./components/MemePreview";
import MemePortalRoot from "./root/MemePortalRoot";
import MemeShowcase from "./components/MemeShowcase";
import UploadBox from "./components/UploadBox";
import HomePanel from "./pages/HomePanel";





customElements.define("meme-preview", MemePreview);
customElements.define("upload-box", UploadBox);
customElements.define('meme-showcase', MemeShowcase);
customElements.define("meme-portal", MemePortalRoot);
customElements.define("home-panel", HomePanel);

