# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY .npmrc* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy prisma schema
COPY apps/mini-chat-server/prisma ./apps/mini-chat-server/prisma

# Generate Prisma Client
RUN cd apps/mini-chat-server && npx prisma generate

# Copy source code
COPY apps ./apps
COPY libs ./libs

# Sync Nx workspace and build the application
RUN NX_DAEMON=false NX_NO_CLOUD=true npx nx sync && \
    NX_DAEMON=false NX_NO_CLOUD=true npx nx build mini-chat-server --configuration=production

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist/apps ./dist

# Copy prisma files and generated client
COPY --from=builder /app/apps/mini-chat-server/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]