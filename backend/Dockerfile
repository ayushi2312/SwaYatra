# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# ---------- Stage 2: Production ----------
FROM node:18-alpine

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app ./

# Install only production deps (optional optimization)
RUN npm prune --production

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]