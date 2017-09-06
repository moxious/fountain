import db from './db';
import { Exchange } from './models/Exchange';
import { Bittrex } from './bittrex';
import { Poloniex } from './poloniex';
import { Coinbase } from './coinbase';
import { Shapeshift } from './shapeshift';
import { Kraken } from './kraken';

import * as yargs from 'yargs';

const provider = yargs.argv.provider;
const operation = yargs.argv.operation;

if (!provider || !operation) {
  console.log('Usage:  fountain --provider=[providername] --operation=[operationname]');
  process.exit(1);
}

interface ExchangeMap {
  [s: string]: Exchange;
}

const providers: ExchangeMap = {
  poloniex: new Poloniex(),
  coinbase: new Coinbase(),
  bittrex: new Bittrex(),
  shapeshift: new Shapeshift(),
  kraken: new Kraken(),
};

const chosen = providers[provider];
if (!chosen) {
  console.error('Unsupported provider; please choose one of ', Object.keys(providers));
  process.exit(1);
}

const supported = chosen.supportedOperations();
if (supported.indexOf(operation) === -1) {
  console.error(`Unsupported operation; for ${provider} please choose one of ${supported}`);
  process.exit(1);
}

// Pass unnamed args
(chosen as any)[operation](...yargs.argv._)
  .then(result => console.log(result))
  .catch(err => console.error('Fountain API Error: ', err));
