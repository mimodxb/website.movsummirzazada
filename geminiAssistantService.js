import { generateContent } from './geminiClient';

// System context defines the persona and knowledge base for the AI
const SYSTEM_CONTEXT = `
You are Mimo's AI Assistant, a helpful and sophisticated virtual concierge for Movsum Mirzazada (Mimo)'s personal website and collective.
Your tone is professional, warm, and creative.

You have knowledge about the following sections of the website:
- **Shop** (/mimo-collective/shop): Exclusive merchandise and products.
- **Legal Complaint Service** (/mimo-collective/legal-complaint-service): A service for structuring legal cases and complaints for non-lawyers.
- **Brands** (/brands): Curated fashion and lifestyle brands partnered with Mimo.
- **Services** (/mimo-collective/general-services): Professional consulting and creative services.
- **Filmography** (/media/filmography): Mimo's work in film and media.
- **About** (/about): Mimo's biography and background.
- **Contact** (/contact): Ways to get in touch.

When users ask about these topics, provide brief, helpful summaries and direct them to the relevant pages if possible.
Do not invent facts. If you don't know something, suggest they contact Mimo directly via the Contact page.
Keep responses concise (under 3-4 sentences usually) unless a detailed explanation is requested.
`;

/**
 * Formats the chat history for the Gemini API.
 * Adds the system context as the first 'user' message (as a prompt engineering technique since system instructions might vary by model version).
 */
const formatHistoryForGemini = (messages) => {
  const formatted = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Prepend system context as a user instruction to set the behavior
  return [
    {
      role: 'user',
      parts: [{ text: `System Instructions: ${SYSTEM_CONTEXT}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I am ready to assist as Mimo's AI concierge." }]
    },
    ...formatted
  ];
};

/**
 * Sends a user message to the Gemini Assistant and gets a response.
 * @param {string} userMessage - The user's input message.
 * @param {Array} history - The current chat history (excluding the new message).
 * @returns {Promise<string>} - The assistant's response.
 */
export async function getGeminiResponse(userMessage, history) {
  try {
    // Append current user message to history
    const currentMessages = [...history, { role: 'user', content: userMessage }];
    
    // Format for API
    const contents = formatHistoryForGemini(currentMessages);
    
    // Call API
    const responseText = await generateContent(contents);
    
    return cleanResponse(responseText);
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "I apologize, but I'm having trouble connecting right now. Please try again later or contact support directly.";
  }
}

/**
 * Cleans up the raw response text from the AI.
 */
function cleanResponse(text) {
  if (!text) return "";
  
  // Fix: Terminate the regex pattern to normalize whitespace and trim the string
  return text.replace(/\s+/g, ' ').trim();
}