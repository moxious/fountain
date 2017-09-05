import { Bittrex } from '../bittrex';

const b: Bittrex = new Bittrex();

// Call never returns; continually runs from websockets.
b.marketSubscribe();
