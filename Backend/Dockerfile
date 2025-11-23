# 1 — Base image
FROM node:18-alpine

# 2 — Set working directory
WORKDIR /app

# 3 — Install dependencies
COPY package*.json ./
RUN npm install

# 4 — Copy source files
COPY . .

# 5 — Generate Prisma Client
RUN npx prisma generate

# 6 — Build TypeScript
RUN npm run build

# 7 — Expose backend port
EXPOSE 3000

# 8 — Start server
CMD ["npm", "start"]
