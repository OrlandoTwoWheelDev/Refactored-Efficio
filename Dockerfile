# 1. Base image
FROM node:23-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json files and install dependencies first (to optimize caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the entire project
COPY . .

# 6. Build the backend + frontend
RUN npm run build

# 7. Expose port
EXPOSE 10000

# 8. Start the app
CMD ["npm", "run", "start"]
