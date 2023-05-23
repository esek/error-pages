FROM node:18-alpine as builder

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY scripts/nginx-conf.js .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm build
RUN node nginx-conf.js >> nginx.conf

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf