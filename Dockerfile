# Compile app
FROM node:14-alpine as builder
WORKDIR /workspace
# Collect compiletime dependencies
ADD package.json .
ADD package-lock.json .
RUN npm ci --unsafe-perm
# Compile source code
COPY . .
RUN npm run-script build 


# Create an image only containing compiled app and runtime dependencies to save space
FROM node:14-alpine
WORKDIR /workspace
COPY server .
# Collect runtime dependencies
RUN npm ci
EXPOSE 80
CMD node ./server

# Copy compiled app
COPY --from=builder /workspace/dist ./dist
