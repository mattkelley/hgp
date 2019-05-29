BigCommerce Webhook CLI
=========

A BigCommerce CLI for registering webhooks. This CLI uses Bunyan for logging, its helpful to pipe the command outputs to `bunyan` for prettier logs.

## Installation
```
# Install dependencies
npm install
# Link the binary to your $PATH
npm link
```
Now you can run `bigcommerce --help` and everything should be gravy. If you are contributing to the CLI, it would be a good idea to `npm unlink` and then run the CLI with `./bin/run COMMAND --help` instead.

## `$ bigcommerce configure`
Creates a CLI config file, required for accessing your store programmatically via the BigCommerce API.

### Create your configuration file
```bash
$ bigcommerce configure --storeHash=w4nabbvvs9 --clientId=your_api_client_id --accessToken=your_api_access_token | bunyan
[2019-05-29T15:56:40.466Z]  INFO: big-commerce-cli/64935 on MattKeleysMBP15: Config created for StoreHash=[w4nabbvvs9] Path=[/Users/mattkelley/.config/big-commerce-cli]
```

### Print your configuration file
```bash
$ bigcommerce configure:print | bunyan
[2019-05-28T21:07:50.745Z]  INFO: big-commerce-cli/54093 on Matt-Kelleys-MBP15.local:
    bigCommerceConfig: {
      "storeHash": "w4nabbvvs9",
      "clientId": "your_api_client_id",
      "accessToken": "your_api_access_token"
    }
```

### Remove your configuration file
```bash
$ bigcommerce configure:remove | bunyan
[2019-05-28T21:14:10.432Z]  INFO: big-commerce-cli/54345 on Matt-Kelleys-MBP15.local: Config file successfully removed
```

## `$ bigcommerce hooks`
Get, register, and delete webhooks for your store.

```bash
$ bigcommerce hooks --help
List, create, or remove a webhook

USAGE
  $ bigcommerce hooks

ALIASES
  $ bigcommerce hooks:index
  $ bigcommerce hooks:list

EXAMPLES
  $ bigcommerce hooks
  $ bigcommerce hooks:register -H=x-api-key:aws-gateway-key -S=store/my/scope -D=https://foo.xyz
  $ bigcommerce hooks:remove --id=123

COMMANDS
  hooks:index     List the registered webhooks
  hooks:register  Register a webhook
  hooks:remove    Remove all webhooks or remove a webhook by Id
```

### List webhooks
When no webhooks are registered, output will appear like:
```bash
$ bigcommerce hooks | bunyan
[2019-05-28T21:26:30.415Z]  INFO: big-commerce-cli/54896 on Matt-Kelleys-MBP15.local: Get webhooks for StoreHash=[w4nansums9] URLPath=[/v2/hooks]
[2019-05-28T21:26:30.698Z]  INFO: big-commerce-cli/54896 on Matt-Kelleys-MBP15.local: []
[2019-05-28T21:26:30.698Z]  INFO: big-commerce-cli/54896 on Matt-Kelleys-MBP15.local: Found Total=[0] webhooks registered to StoreHash=[w4nansums9]
```

```bash
$ bigcommerce hooks | bunyan
[2019-05-28T21:33:24.649Z]  INFO: big-commerce-cli/55312 on Matt-Kelleys-MBP15.local: Get webhooks for StoreHash=[w4nansums9] URLPath=[/v2/hooks]
[2019-05-28T21:33:25.069Z]  INFO: big-commerce-cli/55312 on Matt-Kelleys-MBP15.local:
    [ { id: 17646924,
        client_id: 'your_api_client_id',
        store_hash: 'w4nabbvvs9',
        scope: 'store/order/created',
        destination: 'https://example.com/hello',
        headers: { 'x-api-key': 'foo_key_123' },
        is_active: true,
        created_at: 1559078991,
        updated_at: 1559078991 } ]
[2019-05-28T21:33:25.069Z]  INFO: big-commerce-cli/55312 on Matt-Kelleys-MBP15.local: Found Total=[1] webhooks registered to StoreHash=[w4nabbvvs9]
```

### Register a new webhook

#### `$ bigcommerce hooks:register --help`
```bash
Register a webhook

USAGE
  $ bigcommerce hooks:register

OPTIONS
  -D, --destination=destination  (required) Your BigCommerce Webhook destination
  -H, --headers=headers          Your BigCommerce Webhook headers
  -S, --scope=scope              (required) Your BigCommerce Webhook scope

EXAMPLES
  $ bigcommerce hooks:register --scope=store/order/created --destination=https://example.com --headers=x-api-key:foo123key
  $ bigcommerce hooks:register -S=store/order/created -D=https://example.com -H=x-api-key:foo123key
```

#### Example
```bash
$ bigcommerce hooks:register --scope=store/order/created --destination=https://example.com/hello3 --headers=x-api-key:foo_key_123 | bunyan
[2019-05-28T21:29:51.139Z]  INFO: big-commerce-cli/55121 on Matt-Kelleys-MBP15.local: Register webhook Scope=[store/order/created] Destination=[https://example.com/hello3] for StoreHash=[w4nabbvvs9] URLPath=[/v2/hooks]
[2019-05-28T21:29:51.614Z]  INFO: big-commerce-cli/55121 on Matt-Kelleys-MBP15.local: Successfully registered WebhookId=[17646924]
```

### Remove webhooks

#### `$ bigcommerce hooks:remove --help`
```bash
Remove all webhooks or remove a webhook by Id

USAGE
  $ bigcommerce hooks:remove

OPTIONS
  -A, --all    Remove all registered webhooks
  -I, --id=id  Remove a Webhook by Id

EXAMPLES
  $ bigcommerce hooks:remove --id=123
  $ bigcommerce hooks:remove --all
```

```bash
$ bigcommerce hooks:remove --id=17646946 | bunyan
[2019-05-28T21:38:19.806Z]  INFO: big-commerce-cli/55531 on Matt-Kelleys-MBP15.local: Remove WebhookId=[17646946] for StoreHash=[w4nabbvvs9] URLPath=[/v2/hooks/17646946]
[2019-05-28T21:38:20.237Z]  INFO: big-commerce-cli/55531 on Matt-Kelleys-MBP15.local: Successfully removed WebhookId=[17646946]
```

## Common errors

#### Failed to register webhook
```bash
$ bigcommerce hooks:register --scope=store/order/created --destination=https://example.com/hello --headers=x-api-key:foo_key_123 | bunyan
[2019-05-24T17:03:17.927Z]  INFO: big-commerce-cli/67396 on Matt-Kelleys-MBP15.local: Register webhook Scope=[store/order/created] Destination=[https://example.com/hello] for StoreHash=[w4nabbvvs9] URLPath=[/v2/hooks]
[2019-05-24T17:03:18.396Z]  WARN: big-commerce-cli/67396 on Matt-Kelleys-MBP15.local: Failed to register Webhook for StoreHash=[w4nabbvvs9]
    Error: Request failed with status code 400
        at createError (/Users/mattkelley/Sites/hgp/common/node_modules/axios/lib/core/createError.js:16:15)
        at settle (/Users/mattkelley/Sites/hgp/common/node_modules/axios/lib/core/settle.js:18:12)
        at IncomingMessage.handleStreamEnd (/Users/mattkelley/Sites/hgp/common/node_modules/axios/lib/adapters/http.js:201:11)
        at emitNone (events.js:111:20)
        at IncomingMessage.emit (events.js:208:7)
        at endReadableNT (_stream_readable.js:1064:12)
        at _combinedTickCallback (internal/process/next_tick.js:138:11)
        at process._tickCallback (internal/process/next_tick.js:180:9)
 ›   Error: Failed to register webhook
 ```
 This error with status code `400` and message `Error: Failed to register webhook` typically means an existing webhook already matches the `scope` and `destination` for the `storeHash`. It seems BigCommerce is protecting against duplicate webhook listeners.
