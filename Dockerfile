FROM node:16.20.2-slim AS base
WORKDIR /app
# Faster dependency install with pnpm
RUN npm install -g pnpm
COPY . .

FROM base as build
RUN pnpm install
RUN pnpm run build

FROM devforth/spa-to-http:latest
WORKDIR /app
COPY --from=build /app/dist/ .
