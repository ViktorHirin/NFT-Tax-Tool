import axios from 'axios';

const MORALIS_KEY = 'LJgrel5PZhPaLpLRShkYe2tNvGqUSxtZwudQAeDjWJMLYJ2bEsaG16RWpFJ6rrrf';

const http = axios.create({
    baseURL: 'https://deep-index.moralis.io/api/v2/',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MORALIS_KEY
    }
});

export const getNftsByAddressonMatic = async (_address) => {
    const API_URL = `${_address}/nft`;
    const config = {
        params: {
            chain: 'polygon',
            format: 'decimal'
        }
    };
    const nftsAll = await http.get(API_URL, config);
    const nfts721 = await nftsAll.data.result.filter((value, index) => {
        return value.contract_type === 'ERC721';
    });

    return nfts721;
};
