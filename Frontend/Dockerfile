# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: add custom nginx conf if you need SPA routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
