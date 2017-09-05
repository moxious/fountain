import * as coinbase from 'coinbase';
import { env } from '../env';

class Coinbase {
    protected client: any = null;
    constructor() {
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
}

const cb = new Coinbase();

cb.getAccounts()
    .then(data => console.log(data))
    .catch(err => console.error(err));
