import { useState, useCallback } from 'react';
import { getGeminiResponse } from '@/lib/geminiAssistantService';

export const useGeminiAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm Mimo's AI assistant. How can I help you explore the collective or our services today?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to state immediately
    const userMessage = { role: 'user', content: text };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response using the *current* state of messages plus the new one
      // Note: We pass the 'prev' messages (history) to the service, excluding the one we just added locally 
      // (or we can pass all, service handles it. Let's pass the history before this new message for clarity in service)
      const history = messages; 
      
      const responseText = await getGeminiResponse(text, history);

      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: responseText }
      ]);
      
    } catch (err) {
      console.error("Hook Error:", err);
      setError("Failed to get response");
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "I'm having trouble connecting to the network. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
};