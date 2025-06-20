import Swal from "sweetalert2";
import api from "../api.js";
import anime from "animejs";
import { loadCSS } from "../component/utils/css-loader";

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.validationErrors = {
      title: "",
      body: "",
    };
    this.isSubmitting = false;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.animateForm();
  }

  render() {
    const css = loadCSS("note-form");

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      
      <div class="form-container">
        <h2>Tambahkan Catatan Baru</h2>
        
        <form id="note-form">
          <div class="form-group">
            <label for="title">Judul</label>
            <input type="text" id="title" name="title" required>
            <div class="error-message" id="title-error">${this.validationErrors.title}</div>
          </div>
          
          <div class="form-group">
            <label for="body">Konten</label>
            <textarea id="body" name="body" required></textarea>
            <div class="error-message" id="body-error">${this.validationErrors.body}</div>
          </div>
          
          <div class="form-actions">
            <button type="button" id="cancel-btn">Cancel</button>
            <button type="submit" id="submit-btn" ${this.isSubmitting ? "disabled" : ""}>
              ${this.isSubmitting ? '<span class="spinner"></span>Menyimpan...' : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  animateForm() {
    const formContainer = this.shadowRoot.querySelector(".form-container");

    anime({
      targets: formContainer,
      opacity: [0, 1],
      translateY: ["20px", "0px"],
      easing: "easeOutExpo",
      duration: 800,
    });
  }

  addEventListeners() {
    const form = this.shadowRoot.getElementById("note-form");
    const titleInput = this.shadowRoot.getElementById("title");
    const bodyInput = this.shadowRoot.getElementById("body");
    const cancelBtn = this.shadowRoot.getElementById("cancel-btn");

    // Real-time validation
    titleInput.addEventListener("input", () => {
      this.validateField("title", titleInput.value);
    });

    bodyInput.addEventListener("input", () => {
      this.validateField("body", bodyInput.value);
    });

    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (this.isSubmitting) return;

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      this.validateField("title", title);
      this.validateField("body", body);

      if (!this.validationErrors.title && !this.validationErrors.body) {
        this.isSubmitting = true;
        this.render();

        try {
          console.log("Submitting note:", { title, body });
          const result = await api.addNote(title, body);

          if (result.error) {
            console.error("Error adding note:", result.message);
            Swal.fire({
              icon: "error",
              title: "Gagal menambahkan catatan",
              text:
                result.message || "Terjadi kesalahan saat menambahkan catatan",
              confirmButtonColor: "#b5828c",
            });
          } else {
            console.log("Note added successfully:", result.data);
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: "Catatan berhasil ditambahkan",
              confirmButtonColor: "#b5828c",
            }).then(() => {
              window.dispatchEvent(
                new CustomEvent("navigate", {
                  detail: { view: "notes" },
                }),
              );
            });
          }
        } catch (error) {
          console.error("Unexpected error in form submission:", error);
          Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan",
            text: "Gagal terhubung ke server. Silakan coba lagi nanti.",
            confirmButtonColor: "#b5828c",
          });
        } finally {
          this.isSubmitting = false;
          this.render();
        }
      }
    });

    cancelBtn.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { view: "notes" },
        }),
      );
    });
  }

  validateField(fieldName, value) {
    let errorMessage = "";

    switch (fieldName) {
      case "title":
        if (!value) {
          errorMessage = "Judul Harus Terisi";
        } else if (value.length < 10) {
          errorMessage = "Judul Minimal 10 karakter";
        } else if (value.length > 50) {
          errorMessage = "Judul Harus Kurang dari 50 Karakter";
        }
        break;
      case "body":
        if (!value) {
          errorMessage = "Konten Harus Terisi";
        } else if (value.length < 10) {
          errorMessage = "Konten Harus Lebih dari 10 Karakter";
        }
        break;
    }

    this.validationErrors[fieldName] = errorMessage;

    // Update the error message in the DOM
    const errorElement = this.shadowRoot.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    return !errorMessage;
  }
}

customElements.define("note-form", NoteForm);
