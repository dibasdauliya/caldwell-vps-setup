FROM denoland/deno:latest AS builder

WORKDIR /app

COPY . .

RUN deno cache src/index.ts

# Expose port
EXPOSE 8080

# Run the application
CMD ["deno", "run", "--allow-env", "--allow-read", "--allow-write", "--allow-net", "src/index.ts"]
