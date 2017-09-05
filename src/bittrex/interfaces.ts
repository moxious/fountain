export interface Currency {
    Currency: string;
    CurrencyLong: string;
    MinConfirmation: Number;
    TxFee: Number;
    IsActive: boolean;
    CoinType: string;
    BaseAddress: string;
    Notice: string;
}

/** Mapping from Currency JSON fields to Asset table columns. */
export const CurrencyCSV = {
    Currency: 'symbol',
    CurrencyLong: 'name',
    MinConfirmation: 'minConfirmation',
    TxFee: 'txFee',
    IsActive: 'active',
    CoinType: 'type',
    BaseAddress: 'baseAddress',
    Notice: 'notice',
};

export interface Market {
    MarketCurrency: string;
    BaseCurrency: string;
    MarketCurrencyLong: string;
    BaseCurrencyLong: string;
    MinTradeSize: Number;
    MarketName: string;
    IsActive: boolean;
    Created: string;
    Notice: string;
    IsSponsored: boolean;
    LogoUrl: string;
}

export const MarketCSV = {
    MarketCurrency: 'marketAssetSymbol',
    BaseCurrency: 'baseAssetSymbol',
    MarketCurrencyLong: 'marketAssetName',
    BaseCurrencyLong: 'baseAssetName',
    MinTradeSize: 'minTradeSize',
    MarketName: 'name',
    IsActive: 'active',
    Created: 'created',
    Notice: 'notice',
    IsSponsored: 'sponsored',
    LogoUrl: 'logoURL',
};
