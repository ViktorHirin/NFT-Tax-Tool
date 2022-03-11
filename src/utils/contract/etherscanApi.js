import axios from 'axios';
import { convertUnixToNormal, convertNormalToUnix } from 'utils/Date/convertTime';

// Etherscan pro Api Key
const ETHERSCAN_KEY = 'D6KRVGJN3HE4HUKYRSRRGNZQXTUGG7V7E2';
const USER = '0x6c42a14C3dD527e9EBCd2990371639A5a9354854';

// Axios Configuration
const http = axios.create({
    baseURL: 'https://api.etherscan.io/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getEthNFTTxList = async (_tokenAddress, _address, _start) => {
    const TRANSACTION_BY_ADDRESS_URL = `?module=account&action=tokennfttx&contractaddress=${_tokenAddress}&address=${_address}&page=1&offset=100&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`;
    const response = await http.get(TRANSACTION_BY_ADDRESS_URL);
    let filtered = [];
    if (response.data.status === '1' && response.data.result.length > 0) {
        filtered = response.data.result.filter((value, index) => value.timeStamp > convertNormalToUnix(_start));
    }

    return filtered;
};
