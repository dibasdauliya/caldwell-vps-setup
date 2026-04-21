FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_PRIVATE_WORKER_THREADS=1
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
