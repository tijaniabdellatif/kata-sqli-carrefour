import { BaseService } from '@mini-chat/backend-common-layer';
import { PrismaClient } from '@prisma/client';
import type { ConversationSummary, Conversation, Message } from '@mini-chat/shared-types';

export class ConversationService extends BaseService {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  public static override getInstance<T extends BaseService>(
    this: new () => T
  ): T {
    return super.getInstance<ConversationService>() as unknown as T;
  }

  /**
   * Get all conversations with last message and message count
   * Returns ConversationSummary[] (without full messages array)
   */
  async getAll(): Promise<ConversationSummary[]> {
    const conversations = await this.prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => ({
      id: conv.id,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages[0]
        ? {
            id: conv.messages[0].id,
            content: conv.messages[0].content,
            sender: conv.messages[0].sender as 'user' | 'bot',
            timestamp: conv.messages[0].timestamp,
            conversationId: conv.messages[0].conversationId,
          }
        : undefined,
      messageCount: conv._count.messages,
    }));
  }

  /**
   * Get conversation by ID with full details
   * Returns Conversation (with full messages array)
   */
  async getById(id: string): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    if (!conversation) {
      return null;
    }

    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'bot',
        timestamp: msg.timestamp,
        conversationId: msg.conversationId,
      })),
      messageCount: conversation._count.messages,
      lastMessage: conversation.messages.length > 0
        ? {
            id: conversation.messages[conversation.messages.length - 1].id,
            content: conversation.messages[conversation.messages.length - 1].content,
            sender: conversation.messages[conversation.messages.length - 1].sender as 'user' | 'bot',
            timestamp: conversation.messages[conversation.messages.length - 1].timestamp,
            conversationId: conversation.messages[conversation.messages.length - 1].conversationId,
          }
        : undefined,
    };
  }

  /**
   * Create new conversation
   * Returns ConversationSummary (empty conversation)
   */
  async create(): Promise<ConversationSummary> {
    const conversation = await this.prisma.conversation.create({
      data: {},
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messageCount: 0,
    };
  }

  /**
   * Delete conversation and all its messages
   */
  async delete(id: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { conversationId: id },
    });

    await this.prisma.conversation.delete({
      where: { id },
    });
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender as 'user' | 'bot',
      timestamp: msg.timestamp,
      conversationId: msg.conversationId,
    }));
  }
}