import { problemSchema } from "@/app/moderator/create-problem/components/AddProblemForm";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

export async function addProblem(data: typeof problemSchema._output) {
  console.log(data);
  const baseUrl = process.env.API_BASE_URL_JS || "http://localhost:4000";
  const supabase = createClient();
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    const response = await axios.post(`${baseUrl}/api/problem`, {
      ...data,
      moderatorId: userId,
    });

    if (!response.data.success) {
      throw new Error("Failed to submit problem");
    }
    return response.data;
  } catch (error) {
    console.error("Error submitting problem:", error);
  }
}
