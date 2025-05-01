/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function getDashboardData() {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/dashboard`);
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

export async function updateUser(userId: string, updatedData: any) {
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/users/${userId}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

export async function updateModerator(moderatorId: string, updatedData: any) {
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/moderators/${moderatorId}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating moderator:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

export async function toggleUserBlock(userId: string, shouldBlock: boolean) {
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/user/block/${userId}`,
      { isBlocked: shouldBlock }
    );
    return response;
  } catch (error) {
    console.error("Error toggling user block status:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

export async function toggleModeratorBlock(
  moderatorId: string,
  shouldBlock: boolean
) {
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/moderator/block/${moderatorId}`,
      { isBlocked: shouldBlock }
    );
    return response;
  } catch (error) {
    console.error("Error toggling user block status:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}
