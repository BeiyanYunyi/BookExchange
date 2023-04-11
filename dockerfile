FROM node:19-alpine

# Create app directory
WORKDIR /usr/src/app

COPY ./ ./
# Install app dependencies, build frontend

RUN corepack enable && pnpm install && pnpm build
# copy the rest of the app

COPY ./backend/config/config.example.json ./backend/config/config.json

# expose port 3000
EXPOSE 3001

# start the app
CMD [ "pnpm", "start:server" ]
