# Multi-stage Dockerfile for mini-chat-server in Nx monorepo

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY apps/mini-chat-server/package.json ./apps/mini-chat-server/
COPY apps/mini-chat-server/tsconfig*.json ./apps/mini-chat-server/

# Copy shared libraries
COPY libs ./libs

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application source
COPY apps/mini-chat-server ./apps/mini-chat-server

# Generate Prisma Client
WORKDIR /app/apps/mini-chat-server
RUN npx prisma generate

# Build the application
WORKDIR /app
RUN npx nx build mini-chat-server --configuration=production

# Stage 2: Production
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/mini-chat-server ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/mini-chat-server/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/mini-chat-server/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "main.js"]