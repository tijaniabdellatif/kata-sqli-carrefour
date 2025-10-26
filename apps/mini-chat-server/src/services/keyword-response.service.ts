import { BaseService } from '@mini-chat/backend-common-layer';
import { PrismaClient } from '@prisma/client';
import type { KeywordResponse } from '@mini-chat/shared-types';


export class KeyWordResponseService extends BaseService {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  public static override getInstance<T extends BaseService>(
    this: new () => T
  ): T {
    return super.getInstance<KeyWordResponseService>() as unknown as T;
  }

  async getAll(activeOnly: boolean = false): Promise<KeywordResponse[]> {
    const where = activeOnly ? { isActive: true } : {};

    const response = await this.prisma.keywordResponse.findMany({
      where,
      orderBy: { priority: 'desc' },
    });

    return response;
  }

  async getById(id: string): Promise<KeywordResponse | null> {
    return await this.prisma.keywordResponse.findUnique({
      where: { id },
    });
  }

  async create(data: {
    keywords: string[];
    response: string;
    priority: number;
  }): Promise<KeywordResponse> {
    return await this.prisma.keywordResponse.create({
      data: {
        keywords: data.keywords,
        response: data.response,
        priority: data.priority,
      },
    });
  }

  async update(
    id: string,
    data: {
      keywords?: string[];
      response?: string;
      priority?: number;
      isActive?: boolean;
    }
  ): Promise<KeywordResponse> {
    return await this.prisma.keywordResponse.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.keywordResponse.delete({
      where: { id },
    });
  }


  async toggleActive(id: string): Promise<KeywordResponse> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Keyword response not found');
    }

    return await this.prisma.keywordResponse.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
  }
}
