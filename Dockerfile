# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all source code including tsconfig before install
COPY . .

# Install deps
RUN npm install

# Build backend + frontend
RUN npm run build

# Expose backend port
EXPOSE 10000

# Start backend server
CMD ["node", "dist/src/server.js"]
