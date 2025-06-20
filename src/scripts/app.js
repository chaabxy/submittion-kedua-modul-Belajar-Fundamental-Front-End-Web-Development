import Router from "./router/router.js";
import NoteEvents from "./event-handlers/note-events.js";

class App {
  constructor() {
    this.router = new Router();
    this.noteEvents = new NoteEvents();
    this.init();
  }

  init() {
    this.router.initializeView();
  }
}

export default App;
