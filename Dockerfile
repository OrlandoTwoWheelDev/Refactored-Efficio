# 1. Base image
FROM node:23-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY . .

# 4. Install deps
RUN npm install

# 5. Build the app
RUN npm run build

# 6. Expose port (if needed)
EXPOSE 10000

# 7. Start the app
CMD ["npm", "run", "start"]
