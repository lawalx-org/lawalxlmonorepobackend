# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:20-bullseye AS builder

RUN apt-get update && apt-get install -y \
  python3 make g++ gcc postgresql-client \
  && ln -sf python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

# ------------------------
# Stage 2: Runtime
# ------------------------
FROM node:20-bullseye AS runtime

RUN apt-get update && apt-get install -y \
  python3 make g++ gcc postgresql-client \
  && ln -sf python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
USER node

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/prisma ./prisma
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 5000

# Start container with safety checks + migrations
CMD bash -c '\
  echo "⏳ Waiting for PostgreSQL..."; \
  until pg_isready -h postgres_db -p 5432 -U postgres; do \
    sleep 2; \
  done; \
  echo "⚙️ Generating Prisma Client..."; \
  npx prisma generate; \
  echo "📦 Running Prisma Migrations..."; \
  npx prisma migrate deploy; \
  echo "🚀 Starting NestJS API..."; \
  node dist/main.js \
'