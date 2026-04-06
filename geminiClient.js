// Wrapper for Google Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Calls the Gemini 2.0 Flash API to generate content.
 * @param {Array} contents - The array of content objects (chat history).
 * @returns {Promise<string>} - The generated text response.
 */
export async function generateContent(contents) {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    return "I'm sorry, I'm currently unable to process requests due to a configuration issue.";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from the response structure
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}