# 1 — Base image
FROM node:18-alpine

# 2 — Set working directory
WORKDIR /app

# 3 — Install dependencies
COPY package*.json ./
RUN npm install

# 4 — Copy source files
COPY . .

# 5 — Build TypeScript
RUN npm run build

# 6 — Expose backend port
EXPOSE 3000

# 7 — Start server
CMD ["npm", "start"]
