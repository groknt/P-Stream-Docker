FROM node:25.2.1-alpine as build
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache curl && npm install -g pnpm@10.27.0
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ARG DATABASE_URL
ARG DATABASE_URL_DOCKER
ARG META_NAME
ARG META_DESCRIPTION
ARG CRYPTO_SECRET
ARG TMDB_API_KEY
ARG CAPTCHA=false
ARG CAPTCHA_CLIENT_KEY
ARG NODE_ENV=production

ENV DATABASE_URL="postgresql://user:password@localhost:1234/database?schema=public"
ENV DATABASE_URL_DOCKER=${DATABASE_URL_DOCKER}
ENV META_NAME=${META_NAME}
ENV META_DESCRIPTION=${META_DESCRIPTION}
ENV CRYPTO_SECRET=${CRYPTO_SECRET}
ENV TMDB_API_KEY=${TMDB_API_KEY}
ENV CAPTCHA=${CAPTCHA}
ENV CAPTCHA_CLIENT_KEY=${CAPTCHA_CLIENT_KEY}
ENV NODE_ENV=${NODE_ENV}

COPY . ./
RUN pnpm dlx prisma generate
RUN pnpm run build
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]
