import axios from 'axios';

const http = axios.create({
    baseURL: 'https://ethereum-api.rarible.org/v0.1/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getNFTListByAddress = async (_address) => {
    const NFTLIST_BY_ADDRESS = `nft/items/byOwner`;
    const config = {
        params: {
            owner: _address,
            size: 99999
        }
    };
    const response = await http.get(NFTLIST_BY_ADDRESS, config);
    return response.data;
};
