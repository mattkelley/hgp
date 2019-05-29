import { Command, flags } from '@oclif/command';
import { BigCommerceClient } from '@common/clients/BigCommerce.client';
import { ConfigService, logger } from '../../services';

function processHeaders(headerFlags: string[] = []): { [key: string]: string } {
  return headerFlags.reduce((coll, next) => {
    const splitHeader = next.split(':');
    // Someone didn't follow directions.. ignore the flag
    if (splitHeader.length !== 2) {
      return coll;
    }
    const [key, value] = splitHeader;
    return { ...coll, [key]: value };
  }, {});
}

export default class RegisterWebhook extends Command {
  static description = 'Register a webhook';

  static examples = [
    `$ bigcommerce hooks:register --scope=store/order/created --destination=https://example.com --headers=x-api-key:foo123key`,
    `$ bigcommerce hooks:register -S=store/order/created -D=https://example.com -H=x-api-key:foo123key`,
  ];

  static flags = {
    scope: flags.string({
      char: 'S',
      description: 'Your BigCommerce Webhook scope',
      hidden: false,
      multiple: false,
      required: true,
    }),
    destination: flags.string({
      char: 'D',
      description: 'Your BigCommerce Webhook destination',
      hidden: false,
      multiple: false,
      required: true,
    }),
    headers: flags.string({
      char: 'H',
      required: false,
      description: 'Your BigCommerce Webhook headers',
      hidden: false,
      multiple: true,
    }),
  };

  async run() {
    const { flags } = this.parse(RegisterWebhook);
    const { scope, destination, headers: headerFlags } = flags;

    const config = new ConfigService(this);
    const { storeHash, clientId, accessToken } = await config.get();

    const headers = processHeaders(headerFlags);
    const bigcommerce = new BigCommerceClient({ clientId, clientToken: accessToken, storeHash, logger });

    try {
      const { id } = await bigcommerce.registerWebhook({ headers, scope, destination });
      logger.info('Successfully registered WebhookId=[%d]', id);
    } catch (err) {
      this.error('Failed to register webhook');
      this.exit(1);
    }
    this.exit();
  }
}
