# FROM node:15.4 as build
FROM node:16.14.2-alpine3.15

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# FROM node:15.4
FROM node:16.14.2-alpine3.15
WORKDIR /app
COPY package*.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod
