FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json tsconfig.json tsup.config.ts tailwind-preset.cjs ./
COPY src ./src
RUN npm ci --no-audit --no-fund && npm run build
COPY showcase/package.json showcase/package-lock.json ./showcase/
WORKDIR /workspace/showcase
RUN npm ci --no-audit --no-fund
COPY showcase .
RUN npm run build
FROM nginx:1.27-alpine
COPY showcase/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/showcase/dist /usr/share/nginx/html
EXPOSE 80
