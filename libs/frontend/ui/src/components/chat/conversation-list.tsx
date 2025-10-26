import * as React from 'react';
import type { ConversationSummary } from '@mini-chat/shared-types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { cn, formatTimestamp } from '../../lib/utils';
import { MessageCircle, Trash2, Plus } from 'lucide-react';

export interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  loading?: boolean;
  className?: string;
}

export const ConversationList = React.forwardRef<HTMLDivElement, ConversationListProps>(
  ({ conversations, selectedId, onSelect, onDelete, onNew, loading = false, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col h-full', className)}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              onClick={onNew}
              size="sm"
              disabled={loading}
              title="New conversation"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 p-2 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 p-4 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="mt-1 text-xs">Start chatting to create one!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className={cn(
                    'p-3 cursor-pointer hover:bg-accent transition-colors group',
                    selectedId === conv.id && 'bg-accent border-primary'
                  )}
                  onClick={() => onSelect(conv.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conv.createdAt)}
                        </span>
                      </div>
                      {conv.lastMessage && (
                        <p className="text-sm truncate text-foreground">
                          {conv.lastMessage.content}
                        </p>
                      )}
                      {conv.messageCount !== undefined && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ConversationList.displayName = 'ConversationList';