FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as builder
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store mkdir backend && pnpm i
COPY . .
RUN pnpm build

FROM base
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backend/ ./backend
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i
EXPOSE 3001
# start the app
CMD [ "pnpm", "start:server" ]
