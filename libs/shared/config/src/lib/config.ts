import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(process.cwd(), '.env') });

export interface AppConfig {
  PORT: number;
  NODE_ENV: string;
  HOST: string;
  DATABASE_URL: string;
  REDIS_URL?: string;
  CORS_ORIGIN: string;
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    return {
      PORT: parseInt(process.env.PORT || '3000', 10),
      NODE_ENV: process.env.NODE_ENV || 'development',
      HOST: process.env.HOST || 'localhost',
      DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/chatbot',
      REDIS_URL: process.env.REDIS_URL,
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:4200',
    };
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public getAll(): AppConfig {
    return { ...this.config };
  }
}

export const configService = ConfigService.getInstance();

export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return configService.get(key);
}

export function getAllConfig(): AppConfig {
  return configService.getAll();
}