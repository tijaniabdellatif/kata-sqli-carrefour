import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorMiddleware } from '@mini-chat/backend-common-layer';
import { ChatBotRoutes } from './routes/chatbot.routes';
import { KeyWordResponseRoutes } from './routes/keyword-response.routes';
import { ConversationRoutes } from './routes/conversation.routes';
import { ChatBotService } from './services/chatbot.service';

dotenv.config();

const app: Express = express();
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const conversationRoutes = new ConversationRoutes();
const chatRoutes = new ChatBotRoutes();
const keywordResponseRoutes = new KeyWordResponseRoutes();

app.use('/api/chat/conversations', conversationRoutes.getRouter());
app.use('/api/chat', chatRoutes.getRouter());
app.use('/api/keyword-response', keywordResponseRoutes.getRouter());

app.use(errorMiddleware);

async function initializeApp() {
  try {
    const chatbotService = ChatBotService.getInstance();
    await chatbotService.initializeDefaultResponses();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

const initApp = async () => {
  try {
    const server = app.listen(port, host, async () => {
      console.log(`✅ Backend server running at http://${host}:${port}/api`);
      console.log(`📋 Available routes:`);
      console.log(`   - POST   /api/chat/message`);
      console.log(`   - GET    /api/chat/conversations`);
      console.log(`   - POST   /api/chat/conversations`);
      console.log(`   - GET    /api/chat/conversations/:id`);
      console.log(`   - DELETE /api/chat/conversations/:id`);
      console.log(`   - GET    /api/chat/conversations/:id/messages`);
      console.log(`   - GET    /api/keyword-response`);
      console.log(`   - POST   /api/keyword-response`);

      await initializeApp();
    });

    server.on('error', (error) => {
      console.error('Server error', error);
      process.exit(1);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📡 ${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('📌 HTTP server closed');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error: any) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

initApp();