# Dockerfile – Node + oracledb (thin mode, sem Instant Client)
FROM node:20-alpine

WORKDIR /app

# Instale só o necessário
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o app
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
