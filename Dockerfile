FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

COPY . .
# Install app dependencies, build frontend

RUN corepack enable && pnpm install && pnpm build
# copy the rest of the app

# expose port 3001
EXPOSE 3001

# start the app
CMD [ "pnpm", "start:server" ]
