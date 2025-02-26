export async function apiRequest(url, method = "GET", body = null, headers = {}) {
  try {

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const options = { method, headers: defaultHeaders };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error.message);
    throw error;
  }
}
