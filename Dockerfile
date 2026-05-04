FROM node:20-slim

WORKDIR /app

# Copy root package files (without postinstall for now)
COPY package.json ./

# Install backend production dependencies only (skip postinstall)
RUN npm install --omit=dev --ignore-scripts

# Copy client package files
COPY client/package*.json ./client/

# Install ALL client dependencies (including devDependencies for vite build)
RUN cd client && npm install

# Copy all source code
COPY . .

# Build the React frontend
RUN cd client && npm run build

# Copy built frontend to dist
RUN cp -r client/dist ./dist

# Clean up client node_modules to reduce image size
RUN rm -rf client/node_modules

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
