import { Command } from '@oclif/command';
import { ConfigService, logger } from '../../services';

export default class PrintConfig extends Command {
  static description = 'Print your BigCommerce CLI config';

  async run() {
    const config = new ConfigService(this);

    try {
      const bcConfig = await config.get();
      logger.info({ BigCommerceConfig: bcConfig });
    } catch (err) {
      logger.error({ err }, 'Could not read BigCommerce Config file');
      this.exit(1);
    }
    this.exit();
  }
}
