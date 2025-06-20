// Utility untuk memuat CSS ke dalam Shadow DOM
const cssCache = {};

export const loadCSS = (componentName) => {
  // Jika CSS sudah ada di cache, gunakan dari cache
  if (cssCache[componentName]) {
    return cssCache[componentName];
  }

  // Mapping nama komponen ke CSS
  const cssMap = {
    "app-footer": `
      :host {
        display: block;
        background-color: var(--color-dark);
        color: var(--color-light);
        padding: 1rem 0;
        text-align: center;
        box-shadow: var(--shadow);
      }
      
      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      p {
        margin: 0;
        font-size: 1rem;
      }
      
      @media (max-width: 768px) {
        p {
          font-size: 0.875rem;
        }
      }
    `,
    "app-header": `
      :host {
        display: block;
        background-color: var(--color-dark);
        color: var(--color-light);
        padding: 1rem 0;
        box-shadow: var(--shadow);
      }
      
      .header-container {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      h1 {
        margin: 0;
        font-size: 1.5rem;
        cursor: pointer;
      }
      
      @media (max-width: 768px) {
        h1 {
          font-size: 1.5rem;
        }
      }
    `,
    "loading-indicator": `
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .loader {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid var(--color-accent, #e5989b);
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
      }
      
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
    "loading-screen": `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        z-index: 1000;
      }
      
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      
      .logo {
        font-size: 3rem;
        font-weight: 700;
        color: var(--color-dark);
        margin-bottom: 2rem;
        opacity: 0;
        transform: translateY(20px);
      }
      
      .loading-text {
        font-size: 1.2rem;
        color: var(--color-dark);
        margin-top: 1rem;
        opacity: 0;
      }
      
      .progress-bar {
        width: 200px;
        height: 6px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        margin-top: 1rem;
        overflow: hidden;
        opacity: 0;
      }
      
      .progress {
        height: 100%;
        width: 0%;
        background-color: var(--color-accent);
        border-radius: 3px;
      }
    `,
    "note-form": `
      :host {
        display: block;
        padding: 2rem 0;
      }
      
      .form-container {
        max-width: 600px;
        margin: 50px auto;
        padding: 2rem;
        background-color: var(--color-light);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(20px);
      }
      
      h2 {
        text-align: center;
        color: var(--color-text);
        margin-top: 0;
        margin-bottom: 1.5rem;
        padding: 0.5rem;
        font-weight: bold;
        border: none;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-text);
      }
      
      input,
      textarea {
        width: 95%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-family: inherit;
        font-size: 1rem;
      }
      
      textarea {
        min-height: 200px;
        resize: vertical;
      }
      
      .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        min-height: 1.2rem;
      }
      
      .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }
      
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: var(--border-radius);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      button[type="submit"] {
        background-color: var(--color-dark);
        color: white;
      }
      
      button[type="submit"]:hover {
        background-color: var(--color-accent);
      }
      
      button[type="submit"]:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      
      button[type="button"] {
        background-color: #ddd;
        color: var(--color-text);
      }
      
      button[type="button"]:hover {
        background-color: #ccc;
      }
      
      .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 10px;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      @media (max-width: 768px) {
        .form-container {
          padding: 1.5rem;
        }
      
        .form-actions {
          flex-direction: column-reverse;
          gap: 1rem;
        }
      
        button {
          width: 100%;
        }
      }
    `,
    "note-item": `
      :host {
        display: block;
      }
      
      .note-card {
        background-color: var(--color-light, #fff);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 200px;
        border-left: 5px solid var(--color-accent, #007bff);
        opacity: 0;
      }
      
      .note-card:hover {
        transform: translateY(-3px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
      }
      
      .note-title {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--color-dark, #333);
        margin-bottom: 0.5rem;
        word-wrap: break-word;
        max-height: 2.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .note-body {
        font-size: 1rem;
        color: var(--color-text, #555);
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-bottom: 1rem;
        line-height: 1.5;
      }
      
      .note-footer {
        font-size: 0.9rem;
        color: var(--color-muted, #777);
        font-style: italic;
        text-align: right;
        margin-bottom: 1rem;
      }
      
      .note-actions {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
      
      .note-actions button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .delete-btn {
        background-color: #ff6b6b;
        color: white;
      }
      
      .delete-btn:hover {
        background-color: #ff5252;
      }
      
      .archive-btn {
        background-color: var(--color-dark);
        color: white;
      }
      
      .archive-btn:hover {
        background-color: var(--color-accent);
      }
      
      .spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 5px;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `,
    "note-list": `
      :host {
        display: block;
        padding: 2rem 0;
      }
      
      .notes-container {
        max-width: 1200px;
        margin: auto;
        padding: 0 20px;
      }
      
      .notes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        margin-bottom: 2rem;
        padding: 0rem 1rem;
        border-radius: var(--border-radius);
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
        background: var(--color-light);
      }
      
      .notes-count {
        background: var(--color-dark);
        color: var(--color-light);
        padding: 0.8rem 1.5rem;
        margin-bottom: 5px;
        border-radius: 50px;
        font-weight: bold;
        font-size: 1.1rem;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
      }
      
      .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: var(--color-secondary);
        border-radius: var(--border-radius);
      }
      
      .actions {
        margin-top: 2rem;
        text-align: center;
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
      
      /* Styling untuk tombol */
      button {
        background: var(--color-dark);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        margin-bottom: 0.8rem;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      button:hover {
        background: var(--color-text);
        transform: translateY(-2px);
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
      }
      
      button:active {
        transform: translateY(0);
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
      }
      
      h2 {
        color: var(--color-dark);
        text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9);
      }
      
      .retry-button {
        background: var(--color-accent);
        margin-top: 1rem;
      }
      
      .loading-state {
        text-align: center;
        padding: 3rem;
        background: var(--color-light);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
      }
      
      .loading-spinner {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--color-accent);
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
    "welcome-page": `
      :host {
        display: block;
      }
      
      .welcome-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, var(--color-light), #ffddd2);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        opacity: 0;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      h2 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        color: var(--color-dark);
        text-shadow: 2px 2px 6px rgba(255, 255, 255, 1);
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        letter-spacing: 1px;
        transition: all 0.3s ease-in-out;
        opacity: 0;
      }
      
      h2:hover {
        transform: scale(1.05);
        color: var(--color-accent);
      }
      
      p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        max-width: 600px;
        color: var(--color-text);
        opacity: 0;
        line-height: 1.6;
        font-family: "Poppins", sans-serif;
        font-weight: 400;
        transition: opacity 0.3s ease-in-out;
      }
      
      p:hover {
        opacity: 1;
      }
      
      .buttons-container {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
        opacity: 0;
      }
      
      button {
        background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
        color: var(--color-text);
        border: none;
        padding: 14px 28px;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow);
        font-family: "Poppins", sans-serif;
        letter-spacing: 0.5px;
      }
      
      button:hover {
        background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
        transform: translateY(-3px);
        box-shadow: 0px 6px 15px rgba(209, 123, 136, 0.5);
      }
      
      @media (max-width: 768px) {
        h2 {
          font-size: 2rem;
        }
      
        p {
          font-size: 1rem;
        }
      
        .buttons-container {
          flex-direction: column;
          gap: 1rem;
        }
      }
    `,
    "archived-notes": `
      :host {
        display: block;
      }
    `,
  };

  // Simpan CSS ke cache
  cssCache[componentName] = cssMap[componentName] || "";

  return cssCache[componentName];
};
