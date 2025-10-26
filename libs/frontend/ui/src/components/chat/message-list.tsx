import * as React from 'react';
import type { Message } from '@mini-chat/shared-types';
import { ChatMessage } from './chat-message';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
}

const DefaultEmptyState = () => (

  <div className='flex flex-col items-center justify-center h-full p-8 text-muted-foreground'>

    <div className='flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted'>
      <span className='text-3xl'>🤷‍♂️</span>
    </div>

    <h3 className='mb-2 text-lg font-medium text-foreground'>
      Start a conversation
    </h3>
    <p className='text-sm text-center max-x-xs'>
      Send a message to start chatting with our Bot
    </p>

  </div>
)

const DefaultLoadingIndicator = () => (
  <div className="flex items-start mb-4">
    <div className="max-w-xs px-4 py-3 rounded-lg bg-muted">
      <div className="flex gap-1">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Typing...</span>
      </div>
    </div>
  </div>
);


export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(({ messages, loading = false, className, emptyState = <DefaultEmptyState />, loadingIndicator = <DefaultLoadingIndicator /> }, ref) => {

  return (
    <div ref={ref} className={cn('flex-1 overflow-y-auto p-4 space-y-2', className)}>

      {messages.length === 0 && !loading ? (emptyState) : (
        <>
          {messages.map((message) => {
            return (<ChatMessage key={message.id} message={message} />)
          })}
          {loading && loadingIndicator}
        </>
      )}

    </div>)
})

MessageList.displayName = "MessageList";