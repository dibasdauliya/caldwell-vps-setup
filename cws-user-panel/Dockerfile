FROM node:20.18.3

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
