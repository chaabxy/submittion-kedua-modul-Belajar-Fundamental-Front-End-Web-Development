import api from "../api.js";
import Swal from "sweetalert2";
import anime from "animejs";
import { loadCSS } from "../component/utils/css-loader";

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this.isArchived = false;
    this.isLoading = false;
  }

  static get observedAttributes() {
    return ["notes", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "notes") {
      try {
        this.notes = JSON.parse(newValue) || [];
        this.render();
      } catch (e) {
        console.error("Error parsing notes:", e);
        this.notes = [];
      }
    }

    if (name === "archived") {
      this.isArchived = newValue === "true";
      this.loadNotes();
    }
  }

  connectedCallback() {
    this.isArchived = this.getAttribute("archived") === "true";
    this.render();
    this.loadNotes();
    window.addEventListener("refresh-notes", () => this.loadNotes());
  }

  disconnectedCallback() {
    window.removeEventListener("refresh-notes", () => this.loadNotes());
  }

  async loadNotes() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.renderLoadingState();

    try {
      console.log(
        `Loading ${this.isArchived ? "archived" : "active"} notes...`,
      );

      // Show loading indicator
      const loadingIndicator = document.createElement("loading-indicator");
      document.body.appendChild(loadingIndicator);

      const result = this.isArchived
        ? await api.getArchivedNotes()
        : await api.getNotes();

      // log untuk debugging
      console.log("API response:", result);

      if (result.error) {
        console.error("Error loading notes:", result.message);
        Swal.fire({
          icon: "error",
          title: "Gagal memuat catatan",
          text: result.message || "Terjadi kesalahan saat memuat catatan",
          confirmButtonColor: "#b5828c",
        });
        this.notes = [];
      } else {
        console.log("Notes loaded successfully:", result.data);
        this.notes = Array.isArray(result.data) ? result.data : [];
        console.log(`Jumlah catatan yang ditemukan: ${this.notes.length}`);
      }

      // Remove loading indicator
      if (document.body.contains(loadingIndicator)) {
        document.body.removeChild(loadingIndicator);
      }
    } catch (error) {
      console.error("Unexpected error in loadNotes:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal terhubung ke server. Silakan coba lagi nanti.",
        confirmButtonColor: "#b5828c",
      });
      this.notes = [];
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  renderLoadingState() {
    const css = loadCSS("note-list");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="notes-container">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat catatan...</p>
        </div>
      </div>
    `;
  }

  render() {
    const css = loadCSS("note-list");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="notes-container">
        <div class="notes-header">
          <h2>${this.isArchived ? "Catatan Terarsip" : "Daftar Catatan Kamu"}</h2>
          <div class="notes-count">Total Notes: ${this.notes.length}</div>
        </div>
        <div class="notes-grid">
          ${
            this.isLoading
              ? `<div class="empty-state">
                <h3>Memuat catatan...</h3>
              </div>`
              : this.notes && this.notes.length > 0
                ? this.notes
                    .map((note) => {
                      console.log("Rendering note:", note);
                      return `<note-item 
                        title="${this.escapeHtml(note.title)}" 
                        body="${this.escapeHtml(note.body)}"
                        date="${note.createdAt}"
                        id="${note.id}"
                        archived="${note.archived}"
                      ></note-item>`;
                    })
                    .join("")
                : `<div class="empty-state">
                  <h3>${this.isArchived ? "Tidak ada catatan terarsip" : "Catatan Belum Di Tambahkan"}</h3>
                  <p>${this.isArchived ? "Arsipkan catatan untuk melihatnya di sini" : "Buatlah Catatan Baru Anda!"}</p>
                  <button class="retry-button" id="retry-btn">Coba Lagi</button>
                </div>`
          }
        </div>
        <div class="actions">
          ${!this.isArchived ? '<button id="add-note-btn">➕ Add New Note</button>' : ""}
          ${
            this.isArchived
              ? '<button id="view-active-btn">📝 Lihat Catatan Aktif</button>'
              : '<button id="view-archived-btn">🗃️ Lihat Arsip</button>'
          }
          <button id="back-btn">🏠 Back to Home</button>
        </div>
      </div>
    `;

    this.addEventListeners();
    if (!this.isLoading && this.notes && this.notes.length > 0) {
      this.animateGrid();
    }
  }

  animateGrid() {
    const noteItems = this.shadowRoot.querySelectorAll("note-item");

    if (noteItems.length > 0) {
      anime({
        targets: Array.from(noteItems),
        opacity: [0, 1],
        translateY: ["20px", "0px"],
        easing: "easeOutExpo",
        duration: 800,
        delay: anime.stagger(100),
      });
    }
  }

  escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  addEventListeners() {
    const addNoteBtn = this.shadowRoot.getElementById("add-note-btn");
    if (addNoteBtn) {
      addNoteBtn.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "add-note" },
          }),
        );
      });
    }

    const viewArchivedBtn = this.shadowRoot.getElementById("view-archived-btn");
    if (viewArchivedBtn) {
      viewArchivedBtn.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "archived-notes" },
          }),
        );
      });
    }

    const viewActiveBtn = this.shadowRoot.getElementById("view-active-btn");
    if (viewActiveBtn) {
      viewActiveBtn.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "notes" },
          }),
        );
      });
    }

    const backBtn = this.shadowRoot.getElementById("back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { view: "welcome" },
          }),
        );
      });
    }

    const retryBtn = this.shadowRoot.getElementById("retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.loadNotes();
      });
    }
  }
}

customElements.define("note-list", NoteList);
