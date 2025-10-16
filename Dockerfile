# FROM node:18-alpine AS builder
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# RUN npm install -g @nestjs/cli
# RUN apk add --no-cache postgresql-client
# COPY . .
# RUN npm run build

# FROM node:18-alpine AS production
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci --only=production
# RUN apk add --no-cache postgresql-client
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/prisma ./prisma
# ENV NODE_ENV=production
# EXPOSE 5000
# CMD ["node", "dist/main.js"]


# ------------------------
# Stage 1: Builder
# ------------------------
# FROM node:18-alpine AS builder
# WORKDIR /usr/src/app

# # Copy and install dependencies
# COPY package*.json ./
# RUN npm ci
# RUN npm install -g @nestjs/cli

# # Install PostgreSQL client (for pg_isready or migrations)
# RUN apk add --no-cache postgresql-client

# # Copy all source code and build
# COPY . .
# RUN npm run build

# # ------------------------
# # Stage 2: Production
# # ------------------------
# # ------------------------
# # Stage 2: Production
# # ------------------------
# FROM node:18-alpine AS production
# WORKDIR /usr/src/app

# RUN apk add --no-cache postgresql-client

# COPY package*.json ./
# RUN npm ci 

# # ✅ Add this line
# RUN npm install -g @nestjs/cli

# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/prisma ./prisma

# ENV NODE_ENV=production
# EXPOSE 5000

# CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]








# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci
RUN npm install -g @nestjs/cli

# Install PostgreSQL client (for migrations)
RUN apk add --no-cache postgresql-client

# Copy all source code and build
COPY . .
RUN npm run build

# ------------------------
# Stage 2: Runtime
# ------------------------
FROM node:18-alpine AS runtime
WORKDIR /usr/src/app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci
RUN npm install -g @nestjs/cli

# Copy built dist and prisma schema
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Set environment (can be overridden by docker-compose)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 5000

# Run Prisma migrations before starting app
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

