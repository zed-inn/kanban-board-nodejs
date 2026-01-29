# Use specific Node version requested
FROM node:22-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the specific port requested
EXPOSE 3490

# Start the app
CMD ["npm", "start"]