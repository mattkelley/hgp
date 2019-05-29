import { Command } from '@oclif/command';
import { BigCommerceClient } from '@common/clients/BigCommerce.client';
import { ConfigService, logger } from '../../services';

export default class ListWebhooks extends Command {
  static description = 'List, create, or remove a webhook';

  static examples = [
    `$ bigcommerce hooks`,
    `$ bigcommerce hooks:register -H=x-api-key:aws-gateway-key -S=store/my/scope -D=https://foo.xyz`,
    `$ bigcommerce hooks:remove --id=123`,
  ];

  static aliases = ['hooks:index', 'hooks:list'];

  async run() {
    const config = new ConfigService(this);
    const { storeHash, clientId, accessToken } = await config.get();
    const bigcommerce = new BigCommerceClient({ clientId, clientToken: accessToken, storeHash, logger });

    try {
      const webhooks = await bigcommerce.getAllWebhooks();
      logger.info(webhooks);
      logger.info('Found Total=[%d] webhooks registered to StoreHash=[%s]', webhooks.length, storeHash);
    } catch (err) {
      this.exit(1);
    }

    this.exit();
  }
}
