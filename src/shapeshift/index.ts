import { Exchange } from '../models/Exchange';
import * as request from 'request-promise';
import * as _ from 'lodash';
import * as json2csv from 'json2csv';

// https://info.shapeshift.io/api
export class Shapeshift extends Exchange {
  public static baseURL = 'https://shapeshift.io';
  constructor() {
    super();
    this.name = 'Shapeshift';
  }

  getMarkets() {
    const options = {
      json: true,
      uri: `${Shapeshift.baseURL}/marketinfo/`,
    };

    return request(options)
      .then(data => data.map(item => {
        const [baseAssetSymbol, marketAssetSymbol] = item.pair.split(/[\-_]/);
        return _.merge({
          baseAssetSymbol,
          marketAssetSymbol,
          name: item.pair,
          source: this.name,
        }, _.pick(item, ['limit', 'maxLimit', 'min', 'minerFee', 'rate']));
      }))
      .then(data => json2csv({
        data,
        fields: [
          'baseAssetSymbol',
          'marketAssetSymbol',
          'name',
          'source',
          'limit',
          'maxLimit',
          'min',
          'minerFee',
          'rate',
        ],
      }));
  }

  supportedOperations() {
    return ['getMarkets'];
  }
}
