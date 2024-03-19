import {
  getAssetMetadata,
  getForexListData,
  getHistoricalData,
  getMarketAssetData,
  getTop100MarketAssetData,
} from '../../utils/cryptoMarketsApi';
import {getCryptoHoldingForAddress} from '../../utils/cryptoWalletApi';
import {
  getBestCrossSwapRateBuy,
  getDLNTradeCreateBuyOrder,
} from '../../utils/DLNTradeApi';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from '../../utils/particleCoreSDK';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromMobulaApi = () => {
  return async (dispatch, getState) => {
    const listOfCrypto = getState().market.listOfCrypto ?? [];
    const data = await getMarketAssetData();
    console.log('coin gecko.....', data.length);
    if (data.length > 0) {
      dispatch(marketsAction.setListOfCrypto(listOfCrypto.concat(data)));
    } else {
      console.log(data);
      dispatch(marketsAction.setListOfCrypto([]));
    }
  };
};
// First create an api call to get the desired data in actions/market.js
//100, featured and etc.

export const getListOfForexFromMobulaApi = type => {
  return async (dispatch, getState) => {
    const data = await getForexListData();

    const forexList = [];
    Object.keys(data).forEach(function (key, index) {
      console.log('index', index);
      forexList.push(data[key]);
    });
    console.log('key object', forexList.length, forexList);
    dispatch(marketsAction.setListOfCrypto(forexList));
  };
};
export const setAssetMetadata = assetName => {
  return async (dispatch, getState) => {
    const data = await getAssetMetadata(assetName);
    dispatch(marketsAction.setSelectedAssetData(data));
  };
};
export const setHistoricalDataOfSelectedTimeFrame = (
  assetName,
  currentPrice,
  from,
) => {
  return async (dispatch, getState) => {
    const data = await getHistoricalData(assetName, from);
    const priceOnFromDate = data?.price_history[0][1];

    const percentChange =
      ((currentPrice - priceOnFromDate) * 100) / currentPrice;
    dispatch(
      marketsAction.setSelectedTimeFramePriceInfo({
        percentChange,
        from,
        priceOnSelectedDate: priceOnFromDate,
      }),
    );
  };
};
export const getCryptoHoldingForMarketFromMobula = asset => {
  return async (dispatch, getState) => {
    const address = getState().auth.address;
    const data = await getCryptoHoldingForAddress(address, asset);
    dispatch(marketsAction.setSelectedAssetWalletHolding(data));
  };
};
export const getBestDLNCrossSwapRateBuy = (
  blockchains,
  contractAddress,
  value,
) => {
  return async (dispatch, getState) => {
    console.log('asset contracts best', blockchains, contractAddress);
    const bestRate = await getBestCrossSwapRateBuy(
      blockchains,
      contractAddress,
      value,
    );

    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
export const getBestDLNCrossSwapRateSell = (tokenInfo, value) => {
  return async (dispatch, getState) => {
    console.log(
      'Same Chain sell.....',
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      tokenInfo?.chainId === '137',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    );
    const bestRate = await getDLNTradeCreateBuyOrder(
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      '137',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    );
    console.log('best rates.....sell', JSON.stringify(bestRate));
    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
export const getUSDCHoldingForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log('smart account address holding', eoaAddress);
    const data = await getCryptoHoldingForAddress(eoaAddress, 'USDC');
    console.log('Reducer Portfolio USDC', JSON.stringify(data));
    dispatch(marketsAction.setTokenUsdcBalance(data));
    return data;
  };
};
