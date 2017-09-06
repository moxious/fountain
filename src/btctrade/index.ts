import { Exchange } from '../models/Exchange';

// https://www.btctrade.com/api.help.html?lang=en
export class BTCTrade extends Exchange {
  constructor() {
    super();
    this.name = 'BTCTrade';
  }

  supportedOperations() {
    return [];
  }
}
