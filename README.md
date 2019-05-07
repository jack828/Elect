# Elect

A real time election scheduling & voting platform.

## Installation

This project requires Node v10 & Yarn v1.

``` bash
# install app's dependencies
$ yarn install
```

A MongoDB database running on port 27017 is also required.

## Development

Run the admin panel:

```bash
$ yarn start
```

Run the API:

```bash
$ NODE_ENV=development yarn start:server
```

## Deployment

### Dockerfile

To run server instance:

```
$ docker run \
  --name elect \
  -d \
  -p 3003:3003 \
  -e database=mongo \
  -e MONGO_URI='mongodb://something:port/elect'
```

Set `database` to either `mongo` or `couchbase`. For couchbase, use `COUCHBASE_URI`.

### Tests

Clone the repo & install dependencies.

Run the benchmark:
```
$ USE_MULTICORE=true ARTILLERY_WORKERS=2 artillery run load-test-config.yml -o loadtest && artillery report loadtest
```


Comment out phases in `load-test-config.yml` for a shorter test.
