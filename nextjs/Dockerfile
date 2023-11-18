# Dockerfile for development

# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image 
WORKDIR /nextApp

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of our Next.js folder into /app
COPY . .

# Install dependencies in /app
RUN npm install

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run yarn dev, as we would via the command line 
# RUN ls -al
CMD ["npm", "run", "dev"]
