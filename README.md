# hgp
This [monorepo](https://medium.com/@mattklein123/monorepos-please-dont-e9a279be011b) is a collection of scripts, CLIs, and services for my good friends at [Hungry Ghost Press](https://hungryghostpress.com/). Each sub-directory (or project) will generally consist of it's own `package.json` or equivalent package manager config file. The `common` directory enables code sharing across the sub-directories thanks to [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in Typescript. Feature requests and bugs are tracked in [Github Issues](https://github.com/mattkelley/hgp/issues).

## Install

This project requires Node.js (and npm) to be installed on your system at a version reasonably close to `v8.10.0`. There is an [nvm](https://github.com/nvm-sh/nvm) file at the root of the repo for convenience. I use Node.js `v8.10.0` because its currently used by AWS Lambda. It is also helpful to have [bunyan](https://www.npmjs.com/package/bunyan) installed globally, as the CLIs and services use it for logging.

```bash
git clone git@github.com:mattkelley/hgp.git && cd hgp
nvm use # optional, if you have nvm installed
npm i bunyan -G # optional, nice to have to pipe CLI output
npm install
```
**Note:** For install instructions for an individual service or CLI, see the project's README.

## Projects

* ["In-Store Pickup" service](./in-store-pickup/README.md) - Process BigCommerce orders marked for In-Store pickup
* [BigCommerce CLI](./big-commerce-cli/README.md) - BigCommerce order and webhook operations
* [common](./common/README.md) - DTOs, Enums, Entities, and shared clients e.g [`BigCommerceApiClient`](./common/src/clients/BigCommerce.client.ts)
