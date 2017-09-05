import * as fs from 'fs';
import * as readline from 'readline';
import * as _ from 'lodash';
import * as json2csv from 'json2csv';
import * as Promise from 'bluebird';

const load = (file: string) => new Promise((resolve, reject) => {
  console.log('Loading ', file);
  const buffer: Array<object> = [];
  const stream = fs.createReadStream(file);
  const rd = readline.createInterface({
    input: stream,
  });

  rd.on('line', line => buffer.push(JSON.parse(line)));
  rd.on('close', () => resolve(buffer));
  rd.on('error', err => reject(err));
});

console.log(process.argv);

if (!process.argv[2]) {
  console.log('Call me with a JSON file');
  process.exit(1);
}

Promise.map(process.argv.slice(2), file => load(file), { concurrency: 2 })
  .then(arrays => _.flatten(arrays))
  .then((arr: Array<object>) => {
    console.log('Done!');
    // console.log(_.uniq(arr.map(a => _.get(a, 'M'))));
    const updates = _.flatten(arr.filter(a => (a as any).M === 'updateExchangeState')
      .map((a: any) => {
        // Add received tag onto each record for individual timestamp.
        const r = a.Received;
        return a.A.map(item => _.merge({ Received: r, Source: 'bittrex' }, item));
      }));
    let buys = [];
    let sells = [];
    let fills = [];

    const buyConstant = { TimeStamp: null, OrderType: 'BUY' };
    const sellConstant = { TimeStamp: null, OrderType: 'SELL' };

    updates.forEach((update: any) => {
      const header = _.pick(update, ['MarketName', 'Nounce', 'Received', 'Source']);

      buys = buys.concat((update.Buys || [])
        .map(buy => _.merge(buy, header, buyConstant)));
      sells = sells.concat((update.Sells || [])
        .map(sell => _.merge(sell, header, sellConstant)));
      fills = fills.concat((update.Fills || [])
        .map(fill => _.merge(fill, header)));
    });

    // For now, only show filled orders.
    const orders = _.sortBy(fills, 'Received');

    const o = fs.createWriteStream('orders.csv');
    // See: https://github.com/n0mad01/node.bittrex.api/issues/23
    // {
    //   "Type": 0,
    //   "Rate": 214.74400001,
    //   "Quantity": 79.653,
    //   "MarketName": "USDT-ZEC",
    //   "Nounce": 136818,
    //   "Received": "2017-09-04T19:13:11Z",
    //   "Source": "bittrex",
    //   "TimeStamp": null,
    //   "OrderType": "BUY"
    // },
    const fields = ['Nounce', 'Received', 'MarketName', 'Source',
      'OrderType', 'Quantity', 'Rate', 'TimeStamp', 'Type'];
    o.write(json2csv({
      data: orders,
      fields,
    }));
  })
  .catch(err => console.error('ZOMG', err));
