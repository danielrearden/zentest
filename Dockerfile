FROM node:18-alpine

WORKDIR /zentest

COPY . .

RUN npm install -g pnpm && pnpm install

RUN pnpm build

CMD ["node", "backend/dist/server.js"]
