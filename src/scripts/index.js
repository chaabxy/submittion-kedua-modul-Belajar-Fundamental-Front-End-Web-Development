import "regenerator-runtime";
import "./component/app-footer.js";
import "./component/app-header.js";
import "./component/archived-notes.js";
import "./component/loading-indicator.js";
import "./component/note-form.js";
import "./component/note-items.js";
import "./component/note-list.js";
import "./component/welcome-page.js";
import "./component/loading-screen.js";
import "../styles/style.css";
import App from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
