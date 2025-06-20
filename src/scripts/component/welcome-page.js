import anime from "animejs";
import { loadCSS } from "../component/utils/css-loader";

class WelcomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.animateElements();
  }

  render() {
    const css = loadCSS("welcome-page");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="welcome-container">
        <h2>Selamat Datang di Notes App</h2>
        <p>
          Catat dan kelola ide-ide terbaikmu dengan mudah besti.      
          Mulai dengan melihat catatan yang ada atau buat yang baru sekarang.
        </p>

        <div class="buttons-container">
          <button id="view-notes">Lihat Catatan</button>
          <button id="add-note">Buat Catatan</button>
          <button id="view-archived">Lihat Arsip</button>
        </div>
      </div>
    `;
  }

  animateElements() {
    const container = this.shadowRoot.querySelector(".welcome-container");
    const heading = this.shadowRoot.querySelector("h2");
    const paragraph = this.shadowRoot.querySelector("p");
    const buttons = this.shadowRoot.querySelector(".buttons-container");
    container.style.opacity = 1;
    anime({
      targets: container,
      opacity: [0, 1],
      translateY: ["-20px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
    });

    anime({
      targets: heading,
      opacity: [0, 1],
      translateY: ["-20px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
      delay: 300,
    });

    anime({
      targets: paragraph,
      opacity: [0, 0.85],
      translateY: ["-15px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
      delay: 500,
    });

    anime({
      targets: buttons,
      opacity: [0, 1],
      translateY: ["-10px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
      delay: 700,
    });
  }

  addEventListeners() {
    this.shadowRoot
      .getElementById("view-notes")
      .addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "notes" },
          }),
        );
      });

    this.shadowRoot.getElementById("add-note").addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { view: "add-note" },
        }),
      );
    });

    this.shadowRoot
      .getElementById("view-archived")
      .addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "archived-notes" },
          }),
        );
      });
  }
}

customElements.define("welcome-page", WelcomePage);
