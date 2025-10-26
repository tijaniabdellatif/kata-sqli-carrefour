import { useState, useEffect, useCallback } from 'react';
import '@mini-chat/frontend-ui/styles';
import { ChatWindow, ConversationList } from '@mini-chat/frontend-ui';
import { useConversations } from '../hooks/use-conversation';
import { useChat } from '../hooks/use-chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    conversations,
    loading: conversationsLoading,
    selectedConversationId,
    selectConversation,
    createNewConversation,
    deleteConversation,
    refreshConversations,
  } = useConversations({
    apiUrl: API_URL,
    autoLoad: true,
    onError: (error) => console.error('[App] Conversation error:', error),
  });

 
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading: chatLoading,
    error: chatError,
    conversationId,
    sendMessage,
    clearChat,
    loadMessages,
    messagesEndRef,
  } = useChat({
    apiUrl: API_URL,
    conversationId: selectedConversationId,
    onError: (error) => console.error('[App] Chat error:', error),
    onConversationCreated: (newConvId) => {
      refreshConversations();
      selectConversation(newConvId);
    },
  });

  useEffect(() => {
    console.log('[App] Selected conversation changed:', selectedConversationId);
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    } else {
      clearChat();
    }
  }, [selectedConversationId]);

  const handleNewChat = useCallback(async () => {
    const newConv = await createNewConversation();
    if (newConv) {
      selectConversation(newConv.id);
    }
  }, [createNewConversation, selectConversation]);

  const handleSelectConversation = useCallback((id: string) => {
    selectConversation(id);
  }, [selectConversation]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id);
    if (id === selectedConversationId) {
      clearChat();
    }
  }, [deleteConversation, selectedConversationId, clearChat]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? 'w-80' : 'w-0'}
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200 overflow-hidden
        `}
      >
        {sidebarOpen && (
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            onDelete={handleDeleteConversation}
            onNew={handleNewChat}
            loading={conversationsLoading}
            className="h-full"
          />
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support Chatbot</h1>
              <p className="text-sm text-gray-600">
                {selectedConversationId
                  ? 'Viewing conversation'
                  : 'Start a new conversation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded-full">
              ● Connected
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto">
            <ChatWindow
              apiUrl={API_URL}
              conversationId={conversationId}
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={chatLoading}
              error={chatError}
              sendMessage={sendMessage}
              messagesEndRef={messagesEndRef}
              title="Chat Support"
              description="Ask about pricing, features, or support"
              placeholder="Type your message... (Press Enter to send)"
              showClearButton={true}
            />
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Try asking:
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Hello',
                'What are your prices?',
                'Tell me about features',
                'I need help',
                'Thank you',
              ].map((query) => (
                <button
                  key={query}
                  className="px-3 py-1 text-sm text-blue-700 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
                  onClick={() => {
                    setInputValue(query);
                  }}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;