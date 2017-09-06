MATCH (n)-[r]-(m)
DELETE r;

/* FIAT CURRENCIES */

LOAD CSV WITH HEADERS FROM 'file:///fiat-currencies.csv' AS line
MERGE (a:Asset:Fiat {
  name: line.name,
  symbol: coalesce(line.symbol, ''),
  numericCode: coalesce(line.numericCode, ''),
  minorUnit: coalesce(line.minorUnit, '')
})
MERGE (c:Country { name: line.country })
MERGE (c)-[:issues]->(a);

/* BITTREX */
MERGE (bittrex:Exchange { name: 'Bittrex' });

LOAD CSV WITH HEADERS FROM 'file:///bittrex-markets.csv' AS line
MATCH (bittrex:Exchange { name: 'Bittrex' })
MERGE (ma:Asset {
  name: line.marketAssetName,
  symbol: line.marketAssetSymbol
})
MERGE (ba:Asset {
  name: line.baseAssetName,
  symbol: line.baseAssetSymbol
})
MERGE (mkt:Market {
  name: line.name,
  logoURL: coalesce(line.logoURL, ''),
  created: line.created,
  notice: coalesce(line.notice, ''),
  minTradeSize: line.minTradeSize,
  active: line.active
})
MERGE (mkt)-[:trades]->(ma)
MERGE (mkt)-[:trades]->(ba)
MERGE (bittrex)-[:has]->(mkt);

/* POLONIEX */

MERGE (poloniex:Exchange { name: 'Poloniex' });

LOAD CSV WITH HEADERS FROM 'file:///poloniex-markets.csv' AS line
MATCH (poloniex:Exchange { name: 'Poloniex' })
MERGE (ma:Asset {
  symbol: line.marketAssetSymbol
})
MERGE (ba:Asset {
  symbol: line.baseAssetSymbol
})
MERGE (mkt:Market {
  name: line.name,
  isFrozen: line.isFrozen
})
MERGE (mkt)-[:trades]->(ba)
MERGE (mkt)-[:trades]->(ma)
MERGE (poloniex)-[:has]->(mkt);

/* SHAPESHIFT */

MERGE (shapeshift:Exchange { name: 'Shapeshift' });

LOAD CSV WITH HEADERS FROM 'file:///shapeshift-markets.csv' AS line
MATCH (shapeshift:Exchange { name: 'Shapeshift' })
MERGE (ma:Asset {
  symbol: line.marketAssetSymbol
})
MERGE (ba:Asset {
  symbol: line.baseAssetSymbol
})
MERGE (mkt:Market {
  name: line.name,
  limit: line.limit,
  maxLimit: line.maxLimit,
  min: line.min,
  minerFee: line.minerFee
})
MERGE (mkt)-[:trades]->(ba)
MERGE (mkt)-[:trades]->(ma)
MERGE (shapeshift)-[:has]->(mkt);

/* KRAKEN */
MERGE (kraken:Exchange { name: 'Kraken' });

LOAD CSV WITH HEADERS FROM 'file:///kraken-markets.csv' AS line
MATCH (kraken:Exchange { name: 'Kraken' })
MERGE (ma:Asset {
  symbol: line.marketAssetSymbol
})
MERGE (ba:Asset {
  symbol: line.baseAssetSymbol
})
MERGE (mkt:Market {
  name: line.name,
  lot: line.lot,
  pairDecimals: line.pair_decimals,
  aclassBase: line.aclass_base,
  aclassQuote: line.aclass_quote,
  altname: line.altname,
  feeVolumeCurrency: line.fee_volume_currency
})
MERGE (kraken)-[:has]->(mkt)
MERGE (mkt)-[:trades]->(ma)
MERGE (mkt)-[:trades]->(ba);

/* COINBASE */
MERGE (coinbase:Exchange { name: 'Coinbase' });
MATCH (a:Asset)
WHERE a.symbol = 'BTC' or a.symbol = 'LTC' or a.symbol = 'ETH'
WITH a
MATCH (coinbase:Exchange { name: 'Coinbase' })
WITH a, coinbase
MERGE (coinbase)-[:trades]->(a);

MATCH (bitcoin:Asset { symbol: 'BTC' }),
      (litecoin:Asset { symbol: 'LTC' })
      (ethereum:Asset { symbol: "ETH' })
MERGE (coinbase)-[:trades]->(bitcoin),
      (coinbase)-[:trades]->(litecoin)
      (coinbase)-[:trades]->(ethereum);

/* Cleanup missing asset names */
MATCH (a:Asset) WHERE a.name is null
SET a.name = a.symbol
RETURN count(a);

/* Shortcut trades edges */
MATCH (e:Exchange)-[:has]-(m:Market)-[:trades]->(a:Asset)
MERGE (e)-[:trades]->(a);
