// Import wallet-connectors from web3-react
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

const POLLING_INTERVAL = 12000;

const RPC_URLS = {
    1: 'https://speedy-nodes-nyc.moralis.io/2c7dbf705635580af512f432/eth/mainnet',
    56: 'https://bsc-dataseed.binance.org/',
    137: 'https://speedy-nodes-nyc.moralis.io/2c7dbf705635580af512f432/polygon/mainnet'
};

export const injected = new InjectedConnector({
    supportedChainIds: [1, 56, 137]
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1], 56: RPC_URLS[56], 137: RPC_URLS[137] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    network: 'binance',
    pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
    url: { 1: RPC_URLS[1], 56: RPC_URLS[56], 137: RPC_URLS[137] },
    appName: 'walletlink',
    supportedChainIds: [1, 56, 137]
});
