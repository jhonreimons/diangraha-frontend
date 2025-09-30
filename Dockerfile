# Stage 1: install deps (including dev for build)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# gunakan npm ci jika ada package-lock.json
RUN npm ci

# Stage 2: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# build next
RUN npm run build

# Stage 3: runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# copy only what's needed
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
# pastikan package.json punya "start": "next start -p 3000"
CMD ["npm", "start"]
