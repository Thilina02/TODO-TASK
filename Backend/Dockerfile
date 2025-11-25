FROM node:18-alpine AS builder
WORKDIR /app
 
COPY package*.json ./
RUN npm ci
 
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
 
RUN npx prisma generate
RUN npm run build
 
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
 
COPY package*.json ./
RUN npm ci --omit=dev
 
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
 
COPY prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 3000 

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
