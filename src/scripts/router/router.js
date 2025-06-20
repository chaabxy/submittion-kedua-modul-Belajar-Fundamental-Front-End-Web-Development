class Router {
  constructor() {
    this.currentView = "loading";
    this.routes = {
      loading: () => this.renderLoadingScreen(),
      welcome: () => this.renderWelcomePage(),
      notes: () => this.renderNoteList(),
      "add-note": () => this.renderNoteForm(),
      "archived-notes": () => this.renderArchivedNotes(),
    };

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("navigate", (event) => {
      this.navigateTo(event.detail.view, event.detail.data);
    });

    window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.navigateTo(event.state.view, event.state.data, false);
      }
    });
  }

  initializeView() {
    this.navigateTo("loading", null, false);
    setTimeout(() => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== "loading") {
        this.navigateTo(hash, null, false);
      } else {
        this.navigateTo("welcome", null, false);
      }
    }, 3500);
  }

  navigateTo(view, data = null, updateHistory = true) {
    const appContainer = document.getElementById("app-container");
    appContainer.innerHTML = "";

    this.currentView = view;

    if (updateHistory) {
      history.pushState({ view, data }, "", `#${view}`);
    }

    if (this.routes[view]) {
      this.routes[view]();
    } else {
      this.routes.welcome();
    }
  }

  renderLoadingScreen() {
    const appContainer = document.getElementById("app-container");
    const loadingScreen = document.createElement("loading-screen");
    appContainer.appendChild(loadingScreen);
  }

  renderWelcomePage() {
    const appContainer = document.getElementById("app-container");
    const welcomePage = document.createElement("welcome-page");
    appContainer.appendChild(welcomePage);
  }

  renderNoteList() {
    const appContainer = document.getElementById("app-container");
    const noteList = document.createElement("note-list");
    appContainer.appendChild(noteList);
  }

  renderNoteForm() {
    const appContainer = document.getElementById("app-container");
    const noteForm = document.createElement("note-form");
    appContainer.appendChild(noteForm);
  }

  renderArchivedNotes() {
    const appContainer = document.getElementById("app-container");
    const archivedNotes = document.createElement("archived-notes");
    appContainer.appendChild(archivedNotes);
  }
}

export default Router;
