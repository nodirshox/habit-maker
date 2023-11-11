ARG NODE_VERSION=16-alpine3.16

###
# 1. Dependencies
###

# Build with alpine linux
FROM node:${NODE_VERSION} as builder

ARG ENV_FILE

# Create app directory
WORKDIR /app

COPY tsconfig.json package.json yarn.lock ./
COPY prisma ./prisma/

# Install app dependencies
RUN yarn install --frozen-lockfile

# Comment next line to apply prisma changes not automatically
RUN yarn prisma:generate && yarn migrate-prod

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD [ "yarn", "start:prod" ]
