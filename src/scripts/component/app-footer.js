import { loadCSS } from "../component/utils/css-loader";

class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const css = loadCSS("app-footer");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      
      <div class="footer-container">
        <p>&copy; 2025 Notes App. All rights reserved.</p>
      </div>
    `;
  }
}

customElements.define("app-footer", AppFooter);
