import { createClient } from "@/utils/supabase/client";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL_JS || "http://localhost:4000";

export async function getAllProblems(context: "admin" | "moderator" = "admin") {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;

  try {
    const response = await axios.get(
      context === "moderator" && userId
        ? `${baseUrl}/api/problem?id=${userId}`
        : `${baseUrl}/api/problem`
    );
    return response;
  } catch (error) {
    console.error("Error submitting problem:", error);
  }
}

export async function executeCode(
  problemId: string,
  language: string,
  userCode: string,
  logicCode: string,
  mode: "run" | "submit" = "run"
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  if (!userId) {
    console.log("User ID not found.");
    return;
  }
  if (userId)
    try {
      const response = await axios.post(`${baseUrl}/api/code/execute`, {
        problemId,
        language,
        userCode,
        logicCode,
        userId,
        mode,
      });
      console.log("Response from executeCode:", response);
      return response;
    } catch (error) {
      console.log("Error executing code:", error);
    }
}

export async function getStarterCode(
  id: string,
  context: string = "moderator"
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  try {
    const response = await axios.get(
      userId && context === "user"
        ? `${baseUrl}/api/code/starter-code?id=${id}&userId=${userId}&context=${context}`
        : `${baseUrl}/api/code/starter-code?id=${id}&context=${context}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching starter code:", error);
  }
}

export async function getProblemsList() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  try {
    const response = await axios.get(
      `${baseUrl}/api/problem/list?userId=${userId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching problems list:", error);
  }
}

export async function fetchProblemAttendStatus(problemId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  if (!userId) {
    console.log("User ID not found.");
    return;
  }
  try {
    const response = await axios.get(
      `${baseUrl}/api/problem/attend-status?problemId=${problemId}&userId=${userId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching problem attend status:", error);
  }
}

export async function addProblemDiscussion(id: string, data: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  if (!userId) {
    console.log("User ID not found.");
    return;
  }
  try {
    const response = await axios.post(
      `${baseUrl}/api/problem/discussion/${id}`,
      {
        discussion: data,
        userId,
      }
    );
    return response;
  } catch (error) {
    console.log("Error submitting problem discussion:", error);
  }
}

export async function getProblemDiscussions(id: string) {
  try {
    const response = await axios.get(`${baseUrl}/api/problem/discussion/${id}`);
    console.log("Response from getProblemDiscussions:", response);
    return response;
  } catch (error) {
    console.log("Error fetching problem discussions:", error);
  }
}

export async function getUserPoints() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  if (!userId) {
    console.log("User ID not found.");
    return;
  }
  try {
    const response = await axios.get(
      `${baseUrl}/api/user/points?userId=${userId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching user points:", error);
  }
}
