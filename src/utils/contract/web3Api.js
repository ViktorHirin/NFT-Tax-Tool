// Switch to other Network
import EventBus from 'hooks/eventBus';

export const switchNetwork = async (_library, _chainId, _chainIdDecimal) => {
    await _library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: _chainId
            }
        ]
    });
    EventBus.dispatch('initialize', { type: 'initialize' });
};
