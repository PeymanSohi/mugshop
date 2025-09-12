FROM node:20-alpine
RUN apk add --no-cache wget
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=3001
EXPOSE 3001
CMD ["sh","-lc","node dist/scripts/seed.js && node dist/index.js"]
