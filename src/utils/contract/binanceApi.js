import axios from 'axios';
import { convertUnixToNormal, convertNormalToUnix } from 'utils/Date/convertTime';

// BSC pro Api Key
const BSCSCAN_KEY = '7UG6HX1VNW76Z8FK2A9B5FTHU9QCQM9W68';
const USER = '0x6c42a14C3dD527e9EBCd2990371639A5a9354854';

// Axios Configuration
const http = axios.create({
    baseURL: 'https://api.bscscan.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getTokenInfo = async (_tokenAddress) => {
    const ERC20_URL = `?module=token&action=tokeninfo&contractaddress=${_tokenAddress}&apikey=${BSCSCAN_KEY}`;
    const response = await http.get(ERC20_URL);

    return response.data;
};

export const getNFTList = async (_address) => {
    const HOLDINGNFT_URL = `?module=account&action=addresstokennftbalance&address=${_address}&page=1&offset=100&apikey=${BSCSCAN_KEY}`;
    const response = await http.get(HOLDINGNFT_URL);

    return response.data;
};

export const getNFTTransactionList = async (_tokenAddress, _address, _start) => {
    const TRANSACTION_BY_ADDRESS_URL = `?module=account&action=tokennfttx&contractaddress=${_tokenAddress}&address=${_address}&page=1&offset=100&startblock=0&endblock=999999999&sort=asc&apikey=${BSCSCAN_KEY}`;
    const response = await http.get(TRANSACTION_BY_ADDRESS_URL);
    let filtered = [];
    if (response.data.status === '1' && response.data.result.length > 0) {
        filtered = response.data.result.filter((value, index) => value.timeStamp > convertNormalToUnix(_start));
    }

    return filtered;
};

export const getNormalTransactions = async (_address) => {
    const NORMAL_TRANSACTION_BY_ADDRESS_URL = `?module=account&action=txlistinternal&address=${_address}&startblock=0&endblock=99999999&page=1&offset=10&sort=dec&apikey=${BSCSCAN_KEY}`;
    const response = await http.get(NORMAL_TRANSACTION_BY_ADDRESS_URL);

    return response.data;
};

export const getTransactionsByHash = async (_hash) => {
    const TRANSACTIONS_BY_HASH = `?module=proxy&action=eth_getTransactionByHash&txhash=${_hash}&apikey=${BSCSCAN_KEY}`;
    const response = await http.get(TRANSACTIONS_BY_HASH);

    return response.data;
};
