FROM node:20.18.3

WORKDIR /app


COPY package*.json ./
RUN yarn install

COPY . .

ENV NEXT_PRIVATE_WORKER_THREADS=1
ENV TURBO_CONCURRENCY=1

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
