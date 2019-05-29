import { Command, flags } from '@oclif/command';
import { ConfigService, logger } from '../../services';

export default class CreateConfig extends Command {
  static examples = [
    `$ bigcommerce configure --storeHash=123 --clientId=456 --accessToken=789`,
    `$ bigcommerce configure:print`,
    `$ bigcommerce configure:remove`,
  ];

  static flags = {
    storeHash: flags.string({
      char: 'h',
      description: 'Your BigCommerce store hash',
      hidden: false,
      multiple: false,
      env: 'STORE_HASH',
      required: true,
    }),

    clientId: flags.string({
      char: 'i',
      description: 'Your BigCommerce API client Id',
      hidden: false,
      multiple: false,
      env: 'CLIENT_ID',
      required: true,
    }),

    accessToken: flags.string({
      char: 's',
      description: 'Your BigCommerce API access token',
      hidden: false,
      multiple: false,
      env: 'ACCESS_TOKEN',
      required: true,
    }),
  };

  async run() {
    const { flags } = this.parse(CreateConfig);
    const { storeHash, clientId, accessToken } = flags;
    const config = new ConfigService(this);

    try {
      await config.set({ storeHash, clientId, accessToken });
      logger.info('Config created for StoreHash=[%s] Path=[%s]', storeHash, config.path);
    } catch (err) {
      logger.error({ err }, 'Error creating config for StoreHash=[%s]', storeHash);
      this.exit(1);
    }

    this.exit();
  }
}
