import { loadCSS } from "../component/utils/css-loader";

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const css = loadCSS("app-header");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      
      <div class="header-container">
        <h1>Notes App</h1>
      </div>
    `;

    this.shadowRoot.querySelector("h1").addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { view: "welcome" },
        }),
      );
    });
  }
}

customElements.define("app-header", AppHeader);
