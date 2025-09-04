# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Set permission to override
RUN chown -R node:node /usr/src/app

# Run the application as a non-root user
USER node

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit dev


# Copy the rest of the source files into the image
COPY . .

# Expose the port that the application listens on
EXPOSE 8080

# Run the application
CMD ["npm", "run", "dev"]
