import { Command, flags } from '@oclif/command';
import { BigCommerceClient } from '@common/clients/BigCommerce.client';
import { ConfigService, logger } from '../../services';

export default class RemoveWebhook extends Command {
  static description = 'Remove all webhooks or remove a webhook by Id';

  static examples = [`$ bigcommerce hooks:remove --id=123`, `$ bigcommerce hooks:remove --all`];

  static flags = {
    id: flags.string({
      char: 'I',
      description: 'Remove a Webhook by Id',
      hidden: false,
      multiple: false,
      required: false,
      exclusive: ['all'],
    }),
    all: flags.boolean({
      char: 'A',
      description: 'Remove all registered webhooks',
      hidden: false,
      required: false,
      exclusive: ['id'],
    }),
  };

  async run() {
    const { flags } = this.parse(RemoveWebhook);
    const config = new ConfigService(this);
    const { storeHash, clientId, accessToken } = await config.get();

    const bigcommerce = new BigCommerceClient({ clientId, clientToken: accessToken, storeHash, logger });

    if (flags.all) {
      const removedHooks = await bigcommerce.removeAllWebhooks();
      const ids = removedHooks.map(h => h.id);
      logger.info('Successfully removed WebhookIds=[%s]', ids);
      return this.exit();
    }

    try {
      const { id } = await bigcommerce.removeWebhookById(`${flags.id}`);
      logger.info('Successfully removed WebhookId=[%s]', id);
    } catch (err) {
      this.error(err.message);
      this.exit(1);
    }
    this.exit();
  }
}
