# 1. Base image
FROM node:23-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy project files
COPY . .

# 4. Install dependencies
RUN npm install

# 5. Build backend + frontend
RUN npm run build

# 6. Copy frontend build output (from vite) into where server expects it
RUN mkdir -p dist/client && cp -r client/dist/* dist/client/

# 7. Expose port
EXPOSE 10000

# 8. Start the app
CMD ["npm", "run", "start"]
