FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /workspace
COPY package.json package-lock.json tsconfig.json tsup.config.ts tailwind-preset.cjs ./
COPY src ./src
RUN npm ci --no-audit --no-fund && npm run build

COPY showcase/package.json showcase/package-lock.json ./showcase/
RUN npm ci --prefix showcase --no-audit --no-fund
