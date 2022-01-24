FROM node:17-buster-slim as base

WORKDIR /usr/src/app

RUN apt-get update && \
  apt-get upgrade -y --no-install-recommends && \
  apt-get install -y --no-install-recommends dumb-init && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

ENTRYPOINT [ "dumb-init", "--" ]

FROM base as builder 

ENV NODE_ENV="development"

RUN yarn install --immutable
RUN yarn build

FROM base AS runner

ENV NODE_ENV="production"

RUN rm -r src

USER node

CMD ["node", "."]
