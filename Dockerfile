# ------------------------
# Stage 1: Builder
# ------------------------
 FROM node:20-bullseye AS builder


# Install required build tools for native Node modules
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  gcc \
  postgresql-client \
  && ln -sf python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
RUN npm install -g @nestjs/cli

COPY . .
RUN npm run build

# ------------------------
# Stage 2: Runtime
# ------------------------
FROM node:20-bullseye AS runtime
# Install runtime dependencies (e.g., PostgreSQL client)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  gcc \
  postgresql-client \
  && ln -sf python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci 
RUN npm install -g @nestjs/cli

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 5000

CMD if [ "$NODE_ENV" = "production" ]; then \
      echo "🚀 Running Prisma Migrate Deploy for Production..."; \
      npx prisma migrate deploy && \
      echo "✅ Starting NestJS in Production Mode..." && \
      node dist/main.js; \
    else \
      echo "🚀 Running Prisma Migrate Deploy for Development..."; \
      npx prisma migrate deploy && \
      echo "🧑‍💻 Starting NestJS in Development Mode (Watch)..." && \
      npm run start:dev; \
    fi
