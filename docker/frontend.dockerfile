FROM node:alpine3.19

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]
