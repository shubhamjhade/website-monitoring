FROM node:20-slim

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy client package files
COPY client/package*.json ./client/

# Install all dependencies
RUN npm install --omit=dev
RUN cd client && npm install

# Copy all source code
COPY . .

# Build the React frontend
RUN cd client && npm run build

# Copy built frontend to dist
RUN cp -r client/dist ./dist

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "server.js"]
