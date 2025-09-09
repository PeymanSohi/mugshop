# Multi-stage Dockerfile for Vite React + TypeScript app

# 1) Base dev image
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=true

# Install dependencies separately to leverage Docker cache
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

# 2) Development image
FROM base AS dev
WORKDIR /app
COPY . .
# Vite dev server uses 5173; enable polling for Docker on some hosts
ENV VITE_PORT=5173
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# 3) Build the app (production build)
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

# 4) Production runtime using tiny web server
FROM nginx:alpine AS prod
# Copy built assets to default nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx listens on 80 by default
EXPOSE 80
