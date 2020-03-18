FROM node:12.16

COPY . /workspace
WORKDIR /workspace
RUN npm install
RUN npm audit fix
RUN npm run-script build 

EXPOSE 80
CMD node ./server

