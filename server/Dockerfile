FROM node

ARG port
ENV PORT $port

WORKDIR /app/server


COPY package*.json .

RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]

