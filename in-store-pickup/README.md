

# In Store Pickup

The `in-store-pickup` service is a Serverless project, which uses AWS APIGateway, Lambda, and SSM for storing secrets. The service is a pretty straight-forward POST route which is called by a Big Commerce webhook whenever a new order is created on [Hungry Ghost Press](https://hungryghostpress.com). The lambda receives the webhook body, and looks up details about the order via the BigCommerce API. If the order matches a few criteria, I update the order's shipping status which helps HGP manage their shipments, and in-store pick up orders.

## Development

Install the dependencies
```bash
npm install
```

#### Run the service locally
```
npm start
```
The service will listen on port `http://localhost:3002`. For local development we use the `serverless-offline` plugin, see the [serverless-offline docs](#) for details on available CLI options.

### Run the unit tests
```
npm test

# or in watch mode
npm test -- --watch
```

### Get a test coverage report
```
npm run coverage
```

## Tailing logs

Production logs
```bash
sls logs --function onBigCommerceOrderUpdatedWebhook --stage production --tail
```
Development stage logs
```bash
sls logs --function onBigCommerceOrderUpdatedWebhook --stage dev --tail
```

## Testing a local change on `dev` stage

```
sls deploy --stage dev
sls logs --function onBigCommerceOrderUpdatedWebhook --tail
```
The lambda URL and APIGateway API Key will be returned by the deploy command, use those values when making the example `curl` below. Next `tail` the logs, hopefully everything is gravvy my friend..

```
curl -X POST \
  https://LAMBDA_HASH.execute-api.us-east-1.amazonaws.com/dev/order-updated \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: API_GATEWAY_KEY' \
  -d '{
  "scope": "store/order/created",
  "store_id": "1000060598",
  "data": {
    "type": "order",
    "id": 2971
  },
  "hash": "e3d89eb52d7e49ec777b3842e20bbc9213",
  "created_at": 1549832453,
  "producer": "stores/STORE_HASH"
}'
```
The response should be `{ "message": "OK" }`

For testing the lambda locally, just point to `http://localhost:3002/order-updated` instead.

### Deployment
I use two stages `dev` and `production`.

```bash
sls deploy --stage production
```

If everything was groovy, the deploy command will output something like:
```
Service Information
service: in-store-pickup
stage: dev
region: us-east-1
stack: in-store-pickup-dev
resources: 14
api keys:
  inStorePickupWebhook: FOO_SECRET_API_GATEWAY_KEY
endpoints:
  POST - https://BAR_HASH.execute-api.us-east-1.amazonaws.com/dev/instore-pickup
functions:
  inStorePickupOrder: hgp-store-webhooks-dev-inStorePickupOrder
layers:
  None
```
Take note of the endpoint and API key, we will need it when creating the webhook. For example, the  deployment above could be registered with the `big-commerce-cli` with the following command, using actual values for the api keys (`FOO_SECRET_API_GATEWAY_KEY`) and endpoints (`https://BAR_HASH.execute-api...`)

```bash
$ bigcommerce hooks:register --scope=store/order/statusUpdated --headers=x-api-key:FOO_SECRET_API_GATEWAY_KEY --destination=https://BAR_HASH.execute-api.us-east-1.amazonaws.com/dev/instore-pickup
```

## Production Operations
At this time production deployments happen manually, and require local authentication with `sls` and `aws`. But its easy to deploy new changes to production or tail prod logs.

#### Monitoring production logs

```
sls logs --function onBigCommerceOrderUpdatedWebhook --stage production --tail
```

#### Deploying to production stage
```
sls deploy --stage production
```

## Finding credentials in AWS
👋 👨‍🚀 Hi future Matt, if you need to find some credentials, use the commands below. I (_you_) use APIGateway's Api Keys to authenticate incoming requests to the lambda, each stage has a unique key. The BigCommerce issued API credentials are stored in [SSM Parameter Store](https://console.aws.amazon.com/systems-manager/parameters/?region=us-east-1). At this time, the same credentials for BigCommerce are used in `dev` and `production` stages (consider changing this soon - doesn't make much sense)

#### APIGateway keys
```bash
# Returns an Array of keys, then find the id of the key you need
aws apigateway get-api-keys

# Query your APIGateway key by its Id and add the `include-value` flag
aws apigateway get-api-key --api-key sup6wdw36a --include-value
```

#### SSM Parameter Store secrets
```bash
# Get the production stage's storeHash
aws ssm get-parameter --name production-inStorePickup-storeHash --with-decryption

# Get the production stage's accessToken
aws ssm get-parameter --name production-inStorePickup-storeAccessToken --with-decryption

# Get the production stage's clientId
aws ssm get-parameter --name production-inStorePickup-storeClientId --with-decryption
```

## Registering a BigCommerce Webhook
It's recommended to register webhooks with the `big-commerce-cli` included in this repository, but the following curl commands will also work and are listed for reference.

```bash
export STORE_HASH='store_hash';
export STORE_CLIENT='store_api_client_id';
export STORE_TOKEN='store_api_token';

# Get the active webhooks -> returns an Array of Webhooks
curl -X GET \
  https://api.bigcommerce.com/stores/$STORE_HASH/v2/hooks \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Client: ${STORE_CLIENT}" \
  -H "X-Auth-Token: ${STORE_TOKEN}" \

# Create a webhook -> returns a Webhook entity
curl -X POST \
  https://api.bigcommerce.com/stores/$STORE_HASH/v2/hooks \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Client: ${STORE_CLIENT}" \
  -H "X-Auth-Token: ${STORE_TOKEN}" \
  -d '{
   "scope": "store/order/created",
   "destination": "https://LAMBDA_HASH.execute-api.us-east-1.amazonaws.com/dev/instore-pickup",
   "is_active": true,
   "headers": {
     "x-api-key": "SECRET_API_GATEWAY_KEY"
   }
  }'

# Delete a webhook -> returns the removed webhook entity
# Replace WEB_HOOK_ID with your webhook's ID ;)
curl -X DELETE \
  https://api.bigcommerce.com/stores/$STORE_HASH/v2/hooks/WEB_HOOK_ID \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Client: ${STORE_CLIENT}" \
  -H "X-Auth-Token: ${STORE_TOKEN}" \
```
