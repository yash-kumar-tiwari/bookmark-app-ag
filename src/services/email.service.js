/**
 * Send a welcome email to the user via our server-side API.
 * This is designed not to throw errors so it won't block signup.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.handle
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendWelcomeEmail({ email, handle }) {
  try {
    const response = await fetch("/api/send-welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, handle }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to send welcome email");
    }

    return { success: true };
  } catch (error) {
    console.error("Email service error:", error);
    return { success: false, error: error.message };
  }
}
