# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY apps/mini-chat-server/package.json ./apps/mini-chat-server/
COPY apps/mini-chat-server/tsconfig*.json ./apps/mini-chat-server/

# Copy libs directory if it exists (with proper syntax)
COPY libs/ ./libs/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy application source
COPY apps/mini-chat-server/src ./apps/mini-chat-server/src
COPY apps/mini-chat-server/prisma ./apps/mini-chat-server/prisma

# Generate Prisma Client
WORKDIR /app/apps/mini-chat-server
RUN npx prisma generate

# Build the application with Nx
WORKDIR /app
ENV NX_DAEMON=false
ENV NX_NO_CLOUD=true
RUN npx nx build mini-chat-server --configuration=production

# Stage 2: Production
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder
# Nx builds to dist/apps/mini-chat-server by default
COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/mini-chat-server ./dist

# Copy prisma files and generated client
COPY --from=builder --chown=nodejs:nodejs /app/apps/mini-chat-server/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
