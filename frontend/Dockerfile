FROM node:25.2.1-alpine as build
WORKDIR /app/frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.27.0
COPY providers /app/providers
WORKDIR /app/providers
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG PWA_ENABLED="true"
ENV VITE_PWA_ENABLED=${PWA_ENABLED}
COPY frontend/ ./
RUN pnpm run build

FROM nginx:1.29.4-alpine
RUN apk add --no-cache curl
COPY --from=build /app/frontend/dist /usr/share/nginx/html
RUN sed -i '/^\s*access_log\s\+/c\    access_log off;' /etc/nginx/nginx.conf
COPY frontend/env.sh /docker-entrypoint.d/99-env.sh
RUN chmod +x /docker-entrypoint.d/99-env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
