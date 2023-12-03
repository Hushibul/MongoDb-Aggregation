# Use an official Node.js runtime with Ubuntu as a parent image
FROM node:18-buster-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install && npm install --save-dev

# Copy the current directory contents into the container at /app
COPY . .

# Expose port 3000 (adjust as needed)
EXPOSE 5000

# Run your Node.js application
CMD ["npm", "start"]