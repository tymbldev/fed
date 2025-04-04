# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose port and start app
EXPOSE 3000
CMD ["npm","run", "start"]

