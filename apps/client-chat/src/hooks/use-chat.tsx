import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, MessageResponse } from '@mini-chat/shared-types';
import { useMessages } from './use-message';

interface UseChatOptions {
  apiUrl: string;
  conversationId?: string | null;
  onError?: (error: Error) => void;
  onMessageSent?: (message: Message) => void;
  onConversationCreated?: (conversationId: string) => void;
}

interface UseChatReturn {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  conversationId: string | null;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
  loadMessages: (convId: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// ✅ FIXED: Backend returns "status" not "success"
interface BackendResponse {
  status: string;
  message: string;
  data: MessageResponse;
}

interface MessagesBackendResponse {
  status: string;
  message: string;
  data: Message[];
}

export function useChat(options: UseChatOptions): UseChatReturn {
  const {
    apiUrl,
    conversationId: initialConvId,
    onError,
    onMessageSent,
    onConversationCreated,
  } = options;

  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(
    initialConvId || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  ) as React.RefObject<HTMLDivElement>;

  const isLoadingMessagesRef = useRef(false);
  const isSendingRef = useRef(false);

  const { messages, addMessage, clearMessages, addMessages } = useMessages();

  console.log('[useChat] Current messages count:', messages.length);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Update conversation ID when prop changes
  useEffect(() => {
    if (initialConvId !== conversationId) {
      setConversationId(initialConvId || null);
    }
  }, [initialConvId, conversationId]);

  /**
   * Load messages for a conversation
   */
  const loadMessages = useCallback(
    async (convId: string) => {
      if (isLoadingMessagesRef.current) {
        return;
      }
      isLoadingMessagesRef.current = true;
      setIsLoading(true);
      setError(null);
      clearMessages();

      try {
        const url = `${apiUrl}/api/chat/conversations/${convId}/messages`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load messages: ${response.status}`);
        }

        const result: MessagesBackendResponse = await response.json();
        if (result.status === 'success' && result.data && Array.isArray(result.data)) {
          const loadedMessages: Message[] = result.data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        
          addMessages(loadedMessages);
        } else if (result.status !== 'success') {
          throw new Error(result.message || 'Failed to load messages');
        } else {
          console.warn('[useChat] Invalid response format:', result);
        }
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('[useChat] Load messages error:', error);
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
        isLoadingMessagesRef.current = false;
      }
    },
    [apiUrl, clearMessages, addMessages, onError]
  );

  /**
   * Send a message
   */
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isSendingRef.current) {
      return;
    }

    const content = inputValue.trim();
    isSendingRef.current = true;
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      const url = `${apiUrl}/api/chat/message`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result: BackendResponse = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to send message');
      }

      if (!result.data) {
        throw new Error('No data in response');
      }

      const userMsg: Message = {
        ...result.data.message,
        timestamp: new Date(result.data.message.timestamp),
      };
      console.log('[useChat] Adding user message:', userMsg);
      addMessage(userMsg);
      onMessageSent?.(userMsg);

      if (result.data.botResponse) {
        const botMsg: Message = {
          ...result.data.botResponse,
          timestamp: new Date(result.data.botResponse.timestamp),
        };
        addMessage(botMsg);
      }

      if (!conversationId && userMsg.conversationId) {
        setConversationId(userMsg.conversationId);
        onConversationCreated?.(userMsg.conversationId);
      }
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Unknown Error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  }, [
    inputValue,
    conversationId,
    apiUrl,
    addMessage,
    onMessageSent,
    onConversationCreated,
    onError,
  ]);

 
  const clearChat = useCallback(() => {
    clearMessages();
    setConversationId(null);
    setInputValue('');
    setError(null);
  }, [clearMessages]);

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    conversationId,
    sendMessage,
    clearChat,
    loadMessages,
    messagesEndRef,
  };
}