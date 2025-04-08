FROM node:18-alpine AS base

# Install dependencies-only stage
FROM base AS builder
RUN apk add --no-cache libc6-compat 
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
# Uncomment below to disable Next.js telemetry if desired
# ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./next

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
