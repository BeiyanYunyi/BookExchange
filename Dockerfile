FROM node:lts-alpine as builder
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN mkdir backend && corepack enable && pnpm i
COPY . .
RUN pnpm build

FROM node:lts-alpine
WORKDIR /usr/src/app
RUN corepack enable
COPY --from=builder /usr/src/app/backend/ ./backend
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm i
EXPOSE 3001
# start the app
CMD [ "pnpm", "start:server" ]
