
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/ ./apps/
COPY libs/ ./libs/
RUN npm ci
WORKDIR /app/apps/mini-chat-server
RUN npx prisma generate
WORKDIR /app
ENV NX_DAEMON=false
ENV NX_NO_CLOUD=true
RUN npx nx sync
RUN npx nx build mini-chat-server --configuration=production
FROM node:20-alpine AS runner
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