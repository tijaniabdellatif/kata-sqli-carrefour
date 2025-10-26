import { BaseService } from '@mini-chat/backend-common-layer';
import { PrismaClient } from '@prisma/client';
import type { Message, MessageResponse } from '@mini-chat/shared-types';

export class ChatBotService extends BaseService {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  public static override getInstance<T extends BaseService>(
    this: new () => T
  ): T {
    return super.getInstance<ChatBotService>() as unknown as T;
  }

  async processMessage(
    content: string,
    conversationId?: string
  ): Promise<MessageResponse> {
    const conversation = conversationId
      ? await this.getConversation(conversationId)
      : await this.createConversation();

    const userMessage = await this.prisma.message.create({
      data: {
        content,
        sender: 'user',
        conversationId: conversation.id,
      },
    });

    const botResponseText = await this.generateResponse(content);

    const botMessage = await this.prisma.message.create({
      data: {
        content: botResponseText,
        sender: 'bot',
        conversationId: conversation.id,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return {
      message: this.formatMessage(userMessage),
      botResponse: this.formatMessage(botMessage),
    };
  }

  private async getConversation(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  private async generateResponse(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase();
    const keywordResponses = await this.prisma.keywordResponse.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });

    for (const kr of keywordResponses) {
      for (const keyword of kr.keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          return kr.response;
        }
      }
    }
    return "I'm sorry, I didn't understand your request. Could you please rephrase or ask about pricing, features, or support?";
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map(this.formatMessage);
  }

  private async createConversation() {
    return await this.prisma.conversation.create({
      data: {},
    });
  }

  private formatMessage(message: any): Message {
    return {
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      conversationId: message.conversationId,
    };
  }

  async initializeDefaultResponses(): Promise<void> {
    const existingCount = await this.prisma.keywordResponse.count();
    if (existingCount === 0) {
      const defaultResponses = [
        {
          keywords: ['hello', 'hi', 'hey', 'greetings'],
          response: 'Hello! How can I assist you today?',
          priority: 10,
        },
        {
          keywords: ['price', 'cost', 'pricing', 'how much'],
          response:
            'Our pricing starts at $9.99/month. We offer flexible plans to suit your needs!',
          priority: 9,
        },
        {
          keywords: ['help', 'support', 'assist', 'need help'],
          response:
            "I'm here to help! You can ask me about pricing, features, or any other questions you might have.",
          priority: 8,
        },
        {
          keywords: ['features', 'services', 'what do you offer', 'capabilities'],
          response:
            'We offer various features including cloud storage, real-time sync, 24/7 support, and advanced analytics.',
          priority: 8,
        },
        {
          keywords: ['bye', 'goodbye', 'see you', 'farewell'],
          response:
            'Goodbye! Feel free to come back if you have more questions. Have a great day!',
          priority: 7,
        },
        {
          keywords: ['thanks', 'thank you', 'appreciate'],
          response:
            "You're welcome! Is there anything else I can help you with?",
          priority: 7,
        },
      ];

      await this.prisma.keywordResponse.createMany({
        data: defaultResponses,
      });

      console.log('📌 Default Keyword response initialized');
    }
  }
}