import axios from "axios";

const baseUrl = process.env.API_BASE_URL_JS || "http://localhost:4000";

export async function getUsers() {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/users`);
    return response;
  } catch (error) {
    console.log("Error submitting problem:", error);
  }
}

export async function getModerators() {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/moderators`);
    return response;
  } catch (error) {
    console.log("Error submitting problem:", error);
  }
}
