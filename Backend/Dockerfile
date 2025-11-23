# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# copy package files first (for better caching)
COPY package*.json ./
RUN npm ci

# copy source and prisma files
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# copy build and prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# copy prisma schema if needed (optional)
COPY prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 3000

# Run migrations then start (use npx prisma migrate deploy for production migrations)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
