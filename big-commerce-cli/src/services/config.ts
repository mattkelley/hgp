import { Command } from '@oclif/command';
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const fsStat = util.promisify(fs.stat);
const fsUnlink = util.promisify(fs.unlink);

export interface BigCommerceCliConfig {
  storeHash: string;
  clientId: string;
  accessToken: string;
}

/**
 * Read, write, and delete a BigCommerce CLI config file to disk
 */
export class ConfigService {
  path: string;

  constructor(command: Command) {
    this.path = command.config.configDir;
  }
  /**
   * Check to see if the config file exists
   */
  async exists() {
    try {
      await fsStat(this.path);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get the BigCommerce CLI config from disk
   * @returns BigCommerceCliConfig
   */
  async get() {
    try {
      const contents: string = await readFile(this.path, 'utf8');
      const conf: BigCommerceCliConfig = JSON.parse(contents);
      return conf;
    } catch (err) {
      // Do we need to do something here?
      throw err;
    }
  }

  /**
   * Write a BigCommerce CLI config to disk
   */
  async set(options: BigCommerceCliConfig) {
    try {
      await writeFile(this.path, JSON.stringify(options), 'utf8');
      return;
    } catch (err) {
      // Do we need to do something here matt?
      throw err;
    }
  }

  /**
   * Remove the BigCommerce CLI config from disk
   */
  async delete() {
    if (!(await this.exists())) {
      return;
    }
    try {
      return await fsUnlink(this.path);
    } catch (err) {
      throw new Error('Could not remove BigCommerceCLI config file');
    }
  }
}
