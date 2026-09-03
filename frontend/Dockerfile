# Stage 1: build the Angular app into static files
FROM node:20-alpine AS build
WORKDIR /app

# Copy only the dependency manifests first so Docker can cache
# "npm ci" as its own layer - it only reruns if these files change.
COPY package.json package-lock.json ./
RUN npm ci

# Now copy the actual source and build the production bundle.
COPY . .
RUN npm run build

# Stage 2: serve the built static files with Nginx (no Node.js here at all)
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
