FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Default command to run the Node.js script
CMD ["node", "run.js"]
