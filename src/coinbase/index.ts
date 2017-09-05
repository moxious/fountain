import * as coinbase from 'coinbase';
import { env } from '../env';
import { Exchange } from '../models/Exchange';

export class Coinbase extends Exchange {
  protected client: any = null;
  constructor() {
    super();

    this.name = 'Coinbase';

    this.client = new coinbase.Client({
      apiKey: env('FOUNTAIN_COINBASE_API_KEY'),
      apiSecret: env('FOUNTAIN_COINBASE_API_SECRET')
    });
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      this.client.getAccounts({}, (err, data) => {
        if (err) { return reject(err); }
        return resolve(data);
      });
    });
  }

  supportedOperations(): Array<string> {
    return ['getAccounts'];
  }
}
