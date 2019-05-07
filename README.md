# Elect

A real time election scheduling & voting platform.

## Installation

This project requires Node v10 & Yarn v1.

``` bash
# install app's dependencies
$ yarn install
```

## Development

Run the admin panel:

```bash
$ yarn start
```

Run the API:

```bash
$ NODE_ENV=development yarn start:server
```

By default, it will look for a MongoDB database on 27017.

## Deployment

### Dockerfile

To run server instance:

```
$ docker run \
  --name elect \
  -d \
  -p 3003:3003 \
  -e DATABASE=mongo \
  -e MONGO_URI='mongodb://something:port/elect'
```

Set `database` to either `mongo` or `couchbase`. For couchbase, use `COUCHBASE_URI`.

For full list of env variables, see [config.js](server/config.js) and defaults also in [Dockerfile](./Dockerfile).

### Database

#### MongoDB

Use `DATABASE=mongo` and set `MONGO_URI`.

To initialise database, run the script:

```
$ mongo elect server/support/database/mongo/initialise.js
```

This sets up required indexes, and adds an admin user `admin@elect.dev:123456789`, and sets up the election model.

### Generate a couple votes

Endpoints are available at:

`/generate-votes-slow/:count` - to generate a fixed `count` of random votes

### Tests

Clone the repo & install dependencies.

Run the benchmark:
```
$ USE_MULTICORE=true ARTILLERY_WORKERS=2 artillery run load-test-config.yml -o loadtest && artillery report loadtest
```


Comment out phases in [load-test-config.yml](./load-test-config.yml) for a shorter test.
