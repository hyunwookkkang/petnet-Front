# React Dockerfile
# Step 1: Build Stage
FROM node:16 AS build
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build React application
RUN npm run build

# Step 2: Production Stage
FROM nginx:alpine
# Copy built files to Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]