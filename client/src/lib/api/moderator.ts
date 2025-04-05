import { problemSchema } from "@/app/moderator/create-problem/components/AddProblemForm";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL_JS || "http://localhost:4000";

export async function addProblem(data: typeof problemSchema._output) {
  // console.log(data);
  const supabase = createClient();
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    if (!userId) {
      console.log("User ID not found.");
      return;
    }

    const response = await axios.post(`${baseUrl}/api/problem`, {
      ...data,
      moderatorId: userId,
    });

    return response;
  } catch (error) {
    console.log("Error submitting problem:", error);
  }
}

export async function getProblem(id: string) {
  try {
    const response = await axios.get(
      `${baseUrl}/api/moderator/problem?id=${id}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching problem:", error);
  }
}

export async function deleteProblem(id: string) {
  try {
    const response = await axios.delete(`${baseUrl}/api/problem?id=${id}`);
    return response;
  } catch (error) {
    console.log("Error deleting problem:", error);
  }
}

export async function getPublishStatus(problemId: string) {
  try {
    const response = await axios.get(
      `${baseUrl}/api/moderator/problem/publish-status?id=${problemId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching publish status:", error);
  }
}

export async function setPublishStatus(
  problemId: string,
  status: "published" | "unpublished"
) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/moderator/problem/publish-status`,
      {
        problemId,
        status,
      }
    );
    return response;
  } catch (error) {
    console.log("Error setting publish status:", error);
  }
}
