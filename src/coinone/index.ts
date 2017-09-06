import { Exchange } from '../models/Exchange';

// http://doc.coinone.co.kr
export class CoinOne extends Exchange {
  constructor() {
    super();
    this.name = 'CoinOne';
  }

  supportedOperations() {
    return [];
  }
}
