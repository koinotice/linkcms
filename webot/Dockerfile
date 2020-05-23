# -- Compiler --
FROM node:10.16-alpine as compiler

# Add Python to build node dependencies.
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

LABEL version="2.0.8"

WORKDIR /app
COPY package*.json ./
# Build deps
RUN npm install
COPY . .
RUN npx tsc

# Remove dev deps
RUN npm install --only=production

# Todo maybe build a test phase here.

# -- Release build --
FROM node:10.16-alpine
WORKDIR /app
COPY --from=compiler /app .

CMD ["node", "/app/build/app.js"]