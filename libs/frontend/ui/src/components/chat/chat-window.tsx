import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Trash2 } from 'lucide-react';
import type { Message } from '@mini-chat/shared-types';

export interface ChatWindowProps {
  apiUrl: string;
  conversationId: string | null;
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  sendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  title?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const ChatWindow = React.forwardRef<HTMLDivElement, ChatWindowProps>(
  (
    {
      conversationId,
      messages,
      inputValue,
      setInputValue,
      isLoading,
      error,
      sendMessage,
      messagesEndRef,
      title = 'Support Chat',
      description = 'Ask us anything',
      placeholder = 'Type your message...',
      className,
      showClearButton = false,
      onClear,
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn('flex flex-col h-full', className)}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {showClearButton && messages.length > 0 && onClear && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          <MessageList
            messages={messages}
            loading={isLoading}
            className="flex-1"
          />
          <div ref={messagesEndRef} />

          {error && (
            <div className="px-4 py-2 text-sm border-t bg-destructive/10 text-destructive border-destructive/20">
              ⚠️ {error.message}
            </div>
          )}

          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={sendMessage}
            loading={isLoading}
            placeholder={placeholder}
          />
        </CardContent>
      </Card>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';