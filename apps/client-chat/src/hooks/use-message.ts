import { useState, useCallback } from 'react';
import type { Message } from '@mini-chat/shared-types';

interface UseMessagesReturn {
  messages: Message[];
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
}

export function useMessages(
  initialMessages: Message[] = []
): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      return updated;
    });
  }, []);

  const addMessages = useCallback((newMessages: Message[]) => {
    setMessages((prev) => {
      const updated = [...prev, ...newMessages];
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return {
    messages,
    addMessage,
    addMessages,
    clearMessages,
    removeMessage,
  };
}