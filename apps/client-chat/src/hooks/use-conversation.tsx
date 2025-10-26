import { useState, useCallback, useEffect, useRef } from 'react';
import type { ConversationSummary } from '@mini-chat/shared-types';

interface UseConversationsOptions {
  apiUrl: string;
  autoLoad?: boolean;
  onError?: (error: Error) => void;
}

interface UseConversationsReturn {
  conversations: ConversationSummary[];
  loading: boolean;
  error: Error | null;
  selectedConversationId: string | null;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => void;
  createNewConversation: () => Promise<ConversationSummary | null>;
  deleteConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

interface BackendResponse<T> {
  status: string;
  message: string;
  data: T;
}

export function useConversations(
  options: UseConversationsOptions
): UseConversationsReturn {
  const { apiUrl, autoLoad = true, onError } = options;

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  /**
   * Load all conversations
   */
  const loadConversations = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }

    console.log('[useConversations] Loading conversations...');
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/chat/conversations`);

      if (!response.ok) {
        throw new Error(`Failed to load conversations: ${response.status}`);
      }

      const result: BackendResponse<ConversationSummary[]> =
        await response.json();     
      if (result.status === 'success' && result.data) {
        const formattedConversations = result.data.map((conv) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          lastMessage: conv.lastMessage
            ? {
                ...conv.lastMessage,
                timestamp: new Date(conv.lastMessage.timestamp),
              }
            : undefined,
        }));
       
        setConversations(formattedConversations);
        hasLoadedRef.current = true;
      } else if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to load conversations');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [apiUrl, onError]);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
  }, []);

  /**
   * Create new conversation
   */
  const createNewConversation = useCallback(async (): Promise<ConversationSummary | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const result: BackendResponse<ConversationSummary> =
        await response.json();

      if (result.status === 'success' && result.data) {
        const newConv = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedConversationId(newConv.id);
        return newConv;
      } else if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to create conversation');
      }

      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, onError]);

  /**
   * Delete conversation
   */
  const deleteConversation = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiUrl}/api/chat/conversations/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete conversation: ${response.status}`);
        }

        const result: BackendResponse<null> = await response.json();

        if (result.status === 'success') {
          setConversations((prev) => prev.filter((conv) => conv.id !== id));

          if (selectedConversationId === id) {
            setSelectedConversationId(null);
          }
        } else {
          throw new Error(result.message || 'Failed to delete conversation');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, selectedConversationId, onError]
  );

  /**
   * Refresh conversations
   */
  const refreshConversations = useCallback(async () => {
    hasLoadedRef.current = false;
    await loadConversations();
  }, [loadConversations]);


  useEffect(() => {
    if (autoLoad && !hasLoadedRef.current && !isLoadingRef.current) {
      console.log('[useConversations] Auto-loading conversations on mount');
      loadConversations();
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    selectedConversationId,
    loadConversations,
    selectConversation,
    createNewConversation,
    deleteConversation,
    refreshConversations,
  };
}