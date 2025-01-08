# base image
FROM node:21

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start", "--", "-p", "8000" ]