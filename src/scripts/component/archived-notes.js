import { loadCSS } from "../component/utils/css-loader";

class ArchivedNotes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const css = loadCSS("archived-notes");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <note-list archived="true"></note-list>
    `;
  }
}

customElements.define("archived-notes", ArchivedNotes);
