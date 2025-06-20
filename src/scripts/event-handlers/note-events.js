class NoteEvents {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("refresh-notes", () => {
      console.log("Refresh notes event received");
      const currentView = window.location.hash.replace("#", "") || "notes";
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { view: currentView },
        }),
      );
    });
  }
}

export default NoteEvents;
