import api from "./api";

export async function testBackend() {
  try {
    const response = await api.get("/events");

    console.log("Backend response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "Backend connection error:",
      error.response?.data || error.message
    );

    throw error;
  }
}