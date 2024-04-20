FROM node:alpine3.19

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD ["run", "start"]
