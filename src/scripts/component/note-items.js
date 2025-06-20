import Swal from "sweetalert2";
import api from "../api.js";
import anime from "animejs";
import { loadCSS } from "../component/utils/css-loader";

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isProcessing = false;
  }

  static get observedAttributes() {
    return ["title", "body", "date", "id", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.animateItem();
  }

  animateItem() {
    const noteCard = this.shadowRoot.querySelector(".note-card");

    anime({
      targets: noteCard,
      opacity: [0, 1],
      translateY: ["20px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
      delay: anime.stagger(100),
    });
  }

  render() {
    const title = this.getAttribute("title") || "";
    const body = this.getAttribute("body") || "";
    const date = this.getAttribute("date") || "";
    const id = this.getAttribute("id") || "";
    const archived = this.getAttribute("archived") === "true";

    console.log("Rendering note item:", { title, body, date, id, archived });

    let formattedDate = "";
    if (date) {
      try {
        const dateObj = new Date(date);
        formattedDate = dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.error("Error formatting date:", e);
        formattedDate = date;
      }
    }

    const css = loadCSS("note-item");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="note-card">
        <h3 class="note-title">${title}</h3>
        <p class="note-body">${body}</p>
        ${formattedDate ? `<div class="note-footer">📅 ${formattedDate}</div>` : ""}
        <div class="note-actions">
          <button class="delete-btn" data-id="${id}" ${this.isProcessing ? "disabled" : ""}>
            ${this.isProcessing === "delete" ? '<span class="spinner"></span>' : ""}
            Hapus
          </button>
          <button class="archive-btn" data-id="${id}" ${this.isProcessing ? "disabled" : ""}>
            ${this.isProcessing === "archive" ? '<span class="spinner"></span>' : ""}
            ${archived ? "Batal Arsip" : "Arsipkan"}
          </button>
        </div>
      </div>
    `;

    // Add event listeners for buttons
    this.shadowRoot
      .querySelector(".delete-btn")
      .addEventListener("click", this.handleDelete.bind(this));
    this.shadowRoot
      .querySelector(".archive-btn")
      .addEventListener("click", this.handleArchive.bind(this));

    // Animate the card
    setTimeout(() => {
      const noteCard = this.shadowRoot.querySelector(".note-card");
      if (noteCard) {
        noteCard.style.opacity = "1";
      }
    }, 100);
  }

  async handleDelete(event) {
    if (this.isProcessing) return;

    const id = event.target.dataset.id;

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Catatan yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b5828c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      this.isProcessing = "delete";
      this.render();

      try {
        console.log("Deleting note with ID:", id);
        const response = await api.deleteNote(id);

        if (response.error) {
          console.error("Error deleting note:", response.message);
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus catatan",
            text:
              response.message || "Terjadi kesalahan saat menghapus catatan",
            confirmButtonColor: "#b5828c",
          });
        } else {
          console.log("Note deleted successfully");
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Catatan berhasil dihapus",
            confirmButtonColor: "#b5828c",
          }).then(() => {
            window.dispatchEvent(new CustomEvent("refresh-notes"));
          });
        }
      } catch (error) {
        console.error("Unexpected error in handleDelete:", error);
        Swal.fire({
          icon: "error",
          title: "Terjadi kesalahan",
          text: "Gagal terhubung ke server. Silakan coba lagi nanti.",
          confirmButtonColor: "#b5828c",
        });
      } finally {
        this.isProcessing = false;
        this.render();
      }
    }
  }

  async handleArchive(event) {
    if (this.isProcessing) return;

    const id = event.target.dataset.id;
    const isArchived = this.getAttribute("archived") === "true";

    this.isProcessing = "archive";
    this.render();

    try {
      console.log(
        `${isArchived ? "Unarchiving" : "Archiving"} note with ID:`,
        id,
      );
      const response = isArchived
        ? await api.unarchiveNote(id)
        : await api.archiveNote(id);

      if (response.error) {
        console.error(
          `Error ${isArchived ? "unarchiving" : "archiving"} note:`,
          response.message,
        );
        Swal.fire({
          icon: "error",
          title: `Gagal ${isArchived ? "membatalkan arsip" : "mengarsipkan"} catatan`,
          text:
            response.message ||
            `Terjadi kesalahan saat ${isArchived ? "membatalkan arsip" : "mengarsipkan"} catatan`,
          confirmButtonColor: "#b5828c",
        });
      } else {
        console.log(
          `Note ${isArchived ? "unarchived" : "archived"} successfully`,
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Catatan berhasil ${isArchived ? "dibatalkan dari arsip" : "diarsipkan"}`,
          confirmButtonColor: "#b5828c",
        }).then(() => {
          window.dispatchEvent(new CustomEvent("refresh-notes"));
        });
      }
    } catch (error) {
      console.error(
        `Unexpected error in handle${isArchived ? "Unarchive" : "Archive"}:`,
        error,
      );
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal terhubung ke server. Silakan coba lagi nanti.",
        confirmButtonColor: "#b5828c",
      });
    } finally {
      this.isProcessing = false;
      this.render();
    }
  }
}

customElements.define("note-item", NoteItem);
