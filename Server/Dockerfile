# Step 1: Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install development and production dependencies
RUN npm ci

# Copy application source files
COPY . .

# Step 2: Runtime Environment
FROM node:20-alpine AS runner

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install ONLY production dependencies to keep the image slim
RUN npm ci --only=production

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./server.js

# Create logs directory and assign ownership to the non-privileged node user
RUN mkdir -p logs && chown -R node:node logs

# Expose server port
EXPOSE 5000

# Run the app under the non-privileged 'node' user for security
USER node

# Start execution command
CMD ["node", "server.js"]
