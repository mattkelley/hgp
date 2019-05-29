import { Command } from '@oclif/command';
import { ConfigService, logger } from '../../services';

export default class RemoveConfig extends Command {
  static description = 'Remove your BigCommerce CLI config';

  async run() {
    const config = new ConfigService(this);

    try {
      await config.delete();
      logger.info('Config file successfully removed');
    } catch (err) {
      logger.error({ err }, 'Error removing the config file');
      this.exit(1);
    }
    this.exit();
  }
}
