FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --omit=dev
ENV PORT=3000
EXPOSE 3000
CMD ["sh","-lc","node dist/seed.js && node dist/index.js"]

