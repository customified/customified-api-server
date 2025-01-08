# base image
FROM node:21

WORKDIR /app

COPY . .

RUN npm install
EXPOSE 8000

CMD [ "npm", "run", "dev", "--", "-p", "8000" ]