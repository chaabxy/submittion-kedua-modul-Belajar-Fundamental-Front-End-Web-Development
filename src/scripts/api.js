const BASE_URL = "https://notes-api.dicoding.dev/v2";

const api = {
  async getNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      console.log("API getNotes response:", responseJson);

      if (responseJson.status === "success") {
        return { error: false, data: responseJson.data };
      } else {
        return { error: true, message: responseJson.message };
      }
    } catch (error) {
      console.error("Error in getNotes:", error);
      return { error: true, message: error.message };
    }
  },

  async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      console.log("API getArchivedNotes response:", responseJson);

      if (responseJson.status === "success") {
        return { error: false, data: responseJson.data };
      } else {
        return { error: true, message: responseJson.message };
      }
    } catch (error) {
      console.error("Error in getArchivedNotes:", error);
      return { error: true, message: error.message };
    }
  },

  async getNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`);
      const responseJson = await response.json();

      return responseJson.status === "success"
        ? { error: false, data: responseJson.data }
        : { error: true, message: responseJson.message };
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async addNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title, body }),
      });
      const responseJson = await response.json();

      return responseJson.status === "success"
        ? { error: false, data: responseJson.data }
        : { error: true, message: responseJson.message };
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async deleteNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      const responseJson = await response.json();

      return responseJson.status === "success"
        ? { error: false }
        : { error: true, message: responseJson.message };
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async archiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const responseJson = await response.json();

      return responseJson.status === "success"
        ? { error: false }
        : { error: true, message: responseJson.message };
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async unarchiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const responseJson = await response.json();

      return responseJson.status === "success"
        ? { error: false }
        : { error: true, message: responseJson.message };
    } catch (error) {
      return { error: true, message: error.message };
    }
  },
};

export default api;
