import anime from "animejs";
import { loadCSS } from "../component/utils/css-loader";

class LoadingScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.animateLoader();
  }

  render() {
    const css = loadCSS("loading-screen");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="loading-container">
        <div class="logo">Notes App</div>
        <div class="loading-text">Loading your notes...</div>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
      </div>
    `;
  }

  animateLoader() {
    const logo = this.shadowRoot.querySelector(".logo");
    const loadingText = this.shadowRoot.querySelector(".loading-text");
    const progressBar = this.shadowRoot.querySelector(".progress-bar");
    const progress = this.shadowRoot.querySelector(".progress");

    anime({
      targets: logo,
      opacity: [0, 1],
      translateY: ["20px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
    });

    anime({
      targets: loadingText,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 800,
      delay: 300,
    });

    anime({
      targets: progressBar,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 800,
      delay: 600,
    });

    anime({
      targets: progress,
      width: ["0%", "100%"],
      easing: "easeInOutQuad",
      duration: 3000,
      delay: 900,
      complete: () => {
        this.remove();
      },
    });
  }
}

customElements.define("loading-screen", LoadingScreen);
