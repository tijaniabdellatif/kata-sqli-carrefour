import * as React from 'react';
import type { Message } from '@mini-chat/shared-types';
import { cn, formatTimestamp } from '../../lib/utils';
import { Card } from '../ui/card';

export interface ChatMessageProps {
  message: Message;
  isOwn?: boolean;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, isOwn = false }, ref) => {
    const isBot = message.sender === 'bot';

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full mb-4 animate-fade-in',
          isBot ? 'justify-start' : 'justify-end'
        )}
      >
        <div className={cn('flex flex-col', isBot ? 'items-start' : 'items-end')}>
          {isBot && (
            <div className="flex items-center gap-2 px-1 mb-1">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                <span className="text-xs text-primary-foreground">🤖</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Support Bot
              </span>
            </div>
          )}

          <Card
            className={cn(
              'px-4 py-3 shadow-md w-full rounded-lg',
              isBot
                ? 'bg-muted text-foreground'
                : 'bg-primary text-primary-foreground'
            )}
          >
            <p className="text-sm break-words whitespace-pre-wrap">
              {message.content}
            </p>
            <span
              className={cn(
                'text-xs mt-1 block',
                isBot
                  ? 'text-muted-foreground'
                  : 'text-primary-foreground/70'
              )}
            >
              {formatTimestamp(message.timestamp)}
            </span>
          </Card>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';