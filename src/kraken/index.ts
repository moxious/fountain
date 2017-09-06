import { Exchange } from '../models/Exchange';
import * as request from 'request-promise';
import * as _ from 'lodash';
import * as json2csv from 'json2csv';

// https://www.kraken.com/help/api#public-market-data
export class Kraken extends Exchange {
  public static baseURL = 'https://api.kraken.com/0';

  constructor() {
    super();
    this.name = 'Kraken';
  }

  getMarkets() {
    const options = {
      json: true,
      uri: `${Kraken.baseURL}/public/AssetPairs`
    };

    return request(options)
      .then(data => {
        if (data.error.length > 0) {
          throw new Error(data.error);
        }

        const pairNames = Object.keys(data.result);

        return pairNames.map(pair => {
          const packet = data.result[pair];
          _.set(packet, 'name', pair);

          // Pair is smashed together like this: DASHEUR
          _.set(packet, 'baseAssetSymbol', packet.base);
          const marketSymbol = pair.substring(packet.base.length);
          _.set(packet, 'marketAssetSymbol', marketSymbol);
          _.set(packet, 'source', this.name);

          return packet;
        });
      })
      .then(data => json2csv({
        data,
        fields: [
          'baseAssetSymbol',
          'marketAssetSymbol',
          'name',
          'source',
          'lot',
          'lot_decimals',
          'quote',
          'pair_decimals',
          'aclass_base',
          'aclass_quote',
          'altname',
          'fee_volume_currency',
        ],
      }));
  }

  supportedOperations() {
    return ['getMarkets'];
  }
}
