FROM node:12.16

COPY . /workspace
WORKDIR /workspace
RUN npm ci
RUN npm run-script build 

EXPOSE 80
CMD node ./server

