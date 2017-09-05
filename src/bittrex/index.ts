import * as bittrex from 'node.bittrex.api';
import * as _ from 'lodash';
import { env } from '../env';
import * as moment from 'moment';
import { s3 } from '../s3/index';
import * as fs from 'fs';
import * as json2csv from 'json2csv';
import * as Promise from 'bluebird';
import { chosenMarkets as ChosenMarkets } from './markets';

import {
  asset as AssetFields,
  market as MarketFields,
} from '../models/fields';
import { Currency, CurrencyCSV, MarketCSV } from './interfaces';

export class Bittrex {
  public logfile: string = 'bittrex-log.json';
  private s3: AWS.S3 = null;
  private counter: number = 0;

  constructor() {
    bittrex.options({
      'apikey': env('FOUNTAIN_BITTREX_API_KEY'),
      'apisecret': env('FOUNTAIN_BITTREX_API_SECRET'),
    });

    this.s3 = s3();
  }

  saveS3File(buffer: Array<object>) {
    const Key = `market-update-${moment.utc().format()}.json`;
    const Bucket = 'raw-bittrex';
    const Body = buffer.map(i => JSON.stringify(i)).join('\n');
    const Metadata = {
      captured: moment.utc().format(),
      source: 'bittrex',
      format: 'json',
    };

    const l = buffer.length;
    this.counter = this.counter + buffer.length;

    this.s3.putObject({ Key, Bucket, Body, Metadata }, (err, data) => {
      if (!err) {
        console.log(moment.utc().format(), `${Bucket}/${Key} Batch ${l} Total ${this.counter}`);
        return;
      }
      console.error('S3 Storage Error', err);
    });
  }

  marketSubscribe(markets: Array<String> = ChosenMarkets,
    bufSize = 1000,
    onBufComplete: Function = (buffer: Array<object>) => this.saveS3File(buffer),
    filterFn: Function = i => i) {

    let buffer: Array<any> = [];

    const websocketsclient = bittrex.websockets.subscribe(markets, function (data) {
      if (!filterFn(data)) {
        return;
      }

      _.set(data, 'Received', moment.utc().format());
      buffer.push(data);

      if (buffer.length >= bufSize) {
        onBufComplete(buffer);
        buffer = [];
      }
    });
  }

  convert(record: object, mapping: object) {
    const out = {};
    Object.keys(record).forEach(key => {
      const val = _.get(record, key);
      const mappedKey = mapping[key];

      if (!mappedKey) {
        throw new Error(`No mapping available for input item ${key} in ${JSON.stringify(record)}`);
      }

      out[mappedKey] = val;
    });

    return out;
  }

  bittrexApiMethod(methodName: string, csvMapping: object, fields: any) {
    return new Promise((resolve, reject) => {
      bittrex[methodName]((data, err) => {
        if (err) { return reject(err); }

        return resolve(json2csv({
          data: data.result.map(record => this.convert(record, csvMapping)),
          fields,
        }));
      });
    });
  }

  getMarketHistory(market = 'BTC-LTC') {
    return new Promise((resolve, reject) => {
      bittrex.getmarkethistory({ market }, (data, err) => {
        if (err) { return reject(err); }
        return resolve(data.result);
      });
    });
  }

  getOrderBook() {
    return new Promise((resolve, reject) => {
      bittrex.getorderbook({ market: 'BTC-LTC', type: 'both' }, (data, err) => {
        if (err) { return reject(err); }
        return resolve(data.result);
      });
    });
  }

  getMarkets() {
    return this.bittrexApiMethod('getmarkets', MarketCSV, MarketFields);
  }

  getCurrencies() {
    return this.bittrexApiMethod('getcurrencies', CurrencyCSV, AssetFields);
  }
}
