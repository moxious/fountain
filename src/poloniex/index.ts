import * as request from 'request-promise';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as json2csv from 'json2csv';
import * as moment from 'moment';

const NAME: string = 'Poloniex';
const ONE_HOUR_IN_MS = 1000 * 60 * 60;

export class Poloniex {
  public static BASE_URL = 'https://poloniex.com';

  getTradeHistory(market = 'BTC_ETH',
    start=moment.utc().unix() - ONE_HOUR_IN_MS,
    end=moment.utc().unix()) {
    const options: any = {
      uri: `${Poloniex.BASE_URL}/public`,
      json: true,
      qs: {
        command: 'returnTradeHistory',
        currencyPair: market,
      },
    };

    return request(options)
      .then(data => data.map(record => {
        const transformed = {
          market,
          source: NAME,
        };

        _.set(record, 'date', moment.utc(_.get(record, 'date')).format());

        return _.merge(transformed, record);
      }))
      .then(data => json2csv({
        data,
        fields: [
          'globalTradeID', 'tradeID', 'date', 'market', 'type', 'source',
          'rate', 'amount', 'total',
        ],
      }));
  }

  getMarkets() {
    return request(`${Poloniex.BASE_URL}/public?command=returnTicker`, {
      json: true,
    })
      .then(data => {
        const marketNames = Object.keys(data);
        // console.log('MARKETS ', marketNames);

        return marketNames.map(market => {
          const [baseAssetSymbol, marketAssetSymbol] = market.split(/[_\-]/);
          const entry = data[market];
          return _.merge({
            name: market,
            baseAssetSymbol,
            marketAssetSymbol,
            source: NAME,
          }, entry);
        });
      })
      .then(data => json2csv({
        data,
        fields: [
          'id', 'name', 'source', 'baseAssetSymbol', 'marketAssetSymbol', 'name',
          'last', 'lowestAsk', 'highestBid', 'percentChange', 'baseVolume',
          'quoteVolume', 'isFrozen', 'high24hr', 'low24hr',
        ],
      }));
  }
}

const p: Poloniex = new Poloniex();
p.getTradeHistory()//.getMarkets()
  .then(data => console.log(data))
  .catch(err => console.error('ZOMG', err));
