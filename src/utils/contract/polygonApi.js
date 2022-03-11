import axios from 'axios';

const API_KEY = 'KQ5VX6W4DUM32XJ8VT88Z8URG1ATP7BFME';
const http = axios.create({
    baseURL: 'https://api.polygonscan.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getMaticNFTTxList = async (_tokenAddress, _address) => {
    const API_URL = `?module=account&action=tokennfttx&contractaddress=${_tokenAddress}&address=${_address}&page=1&offset=100&sort=desc&apikey=${API_KEY}`;
    const response = await http.get(API_URL);

    return response.data.result;
};
