# BookExchange

南京信息工程大学易书活动网站源代码

## Usage

```bash
corepack enable
pnpm i
pnpm dev
```

## Environment for backend

```js
const mongoUser = process.env.MONGO_USER; // can be empty
const mongoPassword = process.env.MONGO_PASSWORD; // can be empty
const mongoAddress = process.env.MONGO_ADDRESS ?? 'localhost'; // default localhost
const mongoPort = process.env.MONGO_PORT ?? '27017'; // default 27017
```
