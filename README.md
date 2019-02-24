# hgp
This repo is a serverless project for my good friend Chris at Hungry Ghost Press.

## Running the app locally

```bash
npm start
```

### Skiping cache invalidation

Skiping cache invalidation is the same behavior as a deployed function

```bash
npm start -- --skipCacheInvalidation
```

## Deploy

In order to deploy the endpoint, simply run:

```bash
sls deploy
```

## Usage

Send an HTTP request directly to the endpoint using a tool like curl

```bash
curl -X POST \
  http://localhost:3002/instore-pickup \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: 978testkey' \
  -d '{
  "scope": "store/order/created",
  "store_id": "1000060598",
  "data": {
    "type": "order",
    "id": 2971
  },
  "hash": "e3d89eb52d7e49ec279bbd0cdb3842e20bbc9213",
  "created_at": 1549832453,
  "producer": "stores/plbed37zdn"
}'
```

## Tail logs

```bash
sls logs --function inStorePickupOrder --tail
```


## Registering a BigCommerce Webhook

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
   "destination": "GENERATED_SLS_WEBHOOK_URL",
   "is_active": true,
   "headers": {
     "x-api-key": "GENERATED_API_GATEWAY_KEY"
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
