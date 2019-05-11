FROM node:10.15.0-alpine

WORKDIR /usr/src/app
RUN apk --no-cache add --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make python

ENV DATADOG_API_KEY=YOUR_API_KEY
ENV NODE_ENV=production
ENV DATABASE=mongo
ENV URL=localhost
ENV PORT=3003
ENV MONGO_URI=mongodb://192.168.0.42:27017/elect
ENV COUCHBASE_URI=couchbase://localhost:11210

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn run build


CMD [ "node", "--optimize-for-size", "--max-old-space-size=4096", "--gc_interval=100", "dist/server/app.js" ]
