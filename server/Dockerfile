FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./

COPY --from=builder /app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev && \
  npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/.env && \
  printf '{"development":{},"production":{}}\n' > /app/.env/secrets.json

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.PORT || 8080; require('http').get(`http://localhost:${port}/health`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "dist/src/index.js"]

