# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and configuration
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace
COPY apps/ ./apps/
COPY libs/ ./libs/

# Install dependencies
RUN npm ci

# Generate Prisma Client
WORKDIR /app/apps/mini-chat-server
RUN npx prisma generate

# Build with Nx
WORKDIR /app
ENV NX_DAEMON=false
ENV NX_NO_CLOUD=true

# Sync Nx workspace
RUN npx nx sync

# Build the application
RUN npx nx build mini-chat-server --configuration=production
RUN mkdir -p /app/final-dist && \
    if [ -d "/app/dist/apps/mini-chat-server" ]; then \
      cp -r /app/dist/apps/mini-chat-server/* /app/final-dist/; \
    elif [ -d "/app/apps/mini-chat-server/dist" ]; then \
      cp -r /app/apps/mini-chat-server/dist/* /app/final-dist/; \
    else \
      echo "ERROR: Could not find build output!" && \
      echo "Contents of /app/dist:" && ls -la /app/dist/ && \
      echo "Contents of /app/apps/mini-chat-server:" && ls -la /app/apps/mini-chat-server/ && \
      exit 1; \
    fi && \
    echo "Build output consolidated to /app/final-dist" && \
    ls -la /app/final-dist


FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder --chown=nodejs:nodejs /app/final-dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/mini-chat-server/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production
ENV PORT=3000

USER nodejs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
