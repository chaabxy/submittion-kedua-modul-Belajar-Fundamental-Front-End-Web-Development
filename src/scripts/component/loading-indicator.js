import { loadCSS } from "../component/utils/css-loader";

class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  hide() {
    this.style.display = "none";
  }

  render() {
    const css = loadCSS("loading-indicator");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="loader"></div>
    `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
