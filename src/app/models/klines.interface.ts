export interface Klines {
  _id: string;
  symbol: string;
  timeFrame: string;
  openTime: string;
  openPrice: string;
  highestPrice: string;
  lowestPrice: string;
  closePrice: string;
  volume: string;
  closeTime: string;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  trash: string;
  __v: number;
}

export function parseKline(kline: Klines) {
  return {
    x: new Date(kline.openTime),
    y: [
      parseFloat(kline.openPrice),
      parseFloat(kline.highestPrice),
      parseFloat(kline.lowestPrice),
      parseFloat(kline.closePrice),
    ],
  };
}

export function parseKlineMaxMin(kline: Klines) {
  return {
    x: new Date(kline.openTime),
    y: parseFloat(kline.closePrice),
  };
}
