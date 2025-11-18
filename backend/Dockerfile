# Backend Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies separately for better caching
FROM base AS deps
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma
# .env is not copied; provide environment via platform settings

EXPOSE 4000
CMD ["node", "dist/index.js"]
