###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine As deps

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

USER node



#FROM node:18-alpine As development
#
## Create app directory
#WORKDIR /usr/src/app
#
## Copy application dependency manifests to the container image.
## A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
## Copying this first prevents re-running npm install on every code change.
#COPY --chown=node:node package*.json ./
#
## Install app dependencies using the `npm ci` command instead of `npm install`
#RUN npm ci
#
## Bundle app source
#COPY --chown=node:node . .
#
## Use the node user from the image (instead of the root user)
#USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]