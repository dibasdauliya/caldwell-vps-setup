FROM node:20.18.3-slim

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_PRIVATE_WORKER_THREADS=1

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
