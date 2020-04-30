FROM node:12.16-alpine

WORKDIR /workspace
ADD package.json .
ADD package-lock.json .
RUN npm ci

COPY . .

RUN npm run-script build 

EXPOSE 80
CMD node ./server

