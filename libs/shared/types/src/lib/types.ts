
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  conversationId: string;
}

export interface CreateMessageDto {
  content: string;
  conversationId?: string;
}

export interface MessageResponse {
  message: Message;
  botResponse?: Message;
}


export interface KeywordResponse {
  id: string;
  keywords: string[];
  response: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateKeywordResponseDto {
  keywords: string[];
  response: string;
  priority?: number;
}

export interface UpdateKeywordResponseDto {
  keywords?: string[];
  response?: string;
  priority?: number;
  isActive?: boolean;
}


export interface ConversationSummary {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: Message;
}


export interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  messageCount?: number;
  lastMessage?: Message;
}


export interface CreateConversationDto {
}


export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}