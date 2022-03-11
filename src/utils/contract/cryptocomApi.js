import axios from 'axios';
import { convertUnixToNormal, convertNormalToUnix } from 'utils/Date/convertTime';

// CryptoCompare Pro API

const CC_KEY = '9bd52ab9a0f2b0ad24e0103092029d2ef5f7c9f1ff02d6fc5f62a22dd1f5b778';

export const getTokenUsdPrice = async (_symbol) => {
    const priceInfo = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${_symbol}&tsyms=USD&api_key=${CC_KEY}`);
    return priceInfo.data.USD;
};
