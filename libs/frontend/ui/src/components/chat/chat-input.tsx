import * as React from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import { Send, Loader2 } from 'lucide-react';



export interface ChatInputProps {

  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}


export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>((
  {
    value,
    onChange,
    onSend,
    disabled = false,
    loading = false,
    placeholder = "Type your message...",
    className,
  }, ref
) => {


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();
      if (value.trim() && !disabled && !loading) {

        onSend();

      }
    }
  }

  return (
    <div ref={ref} className={cn('flex items-end gap-2 p-4 bg-background border-t', className)}>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        className='min-h-[60px] max-h-[120px] resize-none'
        rows={1}
      />

      <Button
        onClick={onSend}
        disabled={disabled || loading || !value.trim()}
        size={'icon'}
        className='h-[60px] w-[60px]'
      >
        {
          loading ? (<Loader2 className='w-5 h-5 animate-spin' />) : (<Send className='w-5 h-5' />)
        }
      </Button>

    </div>
  );
})


ChatInput.displayName = "ChatInput";