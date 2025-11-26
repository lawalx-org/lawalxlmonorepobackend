<<<<<<< HEAD



# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN npm install -g @nestjs/cli
RUN apk add --no-cache postgresql-client
COPY . .
=======
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
>>>>>>> dd05457b77be36f6987ac0270cf6ab0c67a3f42e
RUN npm run build

# ------------------------
# Stage 2: Runtime
# ------------------------
<<<<<<< HEAD
FROM node:18-alpine AS runtime
WORKDIR /usr/src/app


RUN apk add --no-cache postgresql-client


COPY package*.json ./
RUN npm ci
RUN npm install -g @nestjs/cli

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
=======
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
>>>>>>> dd05457b77be36f6987ac0270cf6ab0c67a3f42e

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 5000

<<<<<<< HEAD

CMD if [ "$NODE_ENV" = "production" ]; then \
      echo "🚀 Running Prisma Migrate Deploy for Production..."; \
       npx prisma migrate deploy  && \
      echo "✅ Starting NestJS in Production Mode..." && \
      node dist/main.js; \
    else \
      echo "🚀 Running Prisma Migrate Deploy for Development..."; \
      npx prisma migrate deploy && \
      echo "🧑‍💻 Starting NestJS in Development Mode (Watch)..." && \
      npm run start:dev; \
    fi

=======
CMD bash -c '\
  until pg_isready -h postgres_db -p 5432 -U postgres; do \
    echo \"Waiting for PostgreSQL...\"; \
    sleep 2; \
  done; \
  npx prisma migrate deploy; \
  if [ \"$NODE_ENV\" = \"production\" ]; then \
    node dist/main.js; \
  else \
    npm run start:dev; \
  fi'
>>>>>>> dd05457b77be36f6987ac0270cf6ab0c67a3f42e
