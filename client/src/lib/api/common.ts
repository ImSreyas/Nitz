import axios from "axios";

const baseUrl = process.env.API_BASE_URL_JS || "http://localhost:4000";

export async function getAllProblems() {
  try {
    return await axios.get(`${baseUrl}/api/problem`);
  } catch (error) {
    console.error("Error submitting problem:", error);
  }
}

export async function executeCode(
  problemId: string,
  language: string,
  code: string
) {
  try {
    const response = await axios.post(`${baseUrl}/api/code/execute`, {
      problemId,
      language,
      code,
    });
    return response;
  } catch (error) {
    console.error("Error executing code:", error);
  }
}
