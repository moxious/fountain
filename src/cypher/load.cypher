MATCH (n)-[r]-(m)
DELETE r;

MERGE (bittrex:Exchange { name: 'Bittrex' });

/* Load bittrex markets */
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

MERGE (poloniex:Exchange { name: 'Poloniex' });

/* Load poloniex markets */
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

MERGE (shapeshift:Exchange { name: 'Shapeshift' });

/* Load shapeshift markets */
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

/* Shortcut trades edges */
MATCH (e:Exchange)-[:has]-(m:Market)-[:trades]->(a:Asset)
MERGE (e)-[:trades]->(a);
