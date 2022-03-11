import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// web3 Provider
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from 'utils/connectors/WalletConnector';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import config from 'config';

// const
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const Web3Context = createContext(null);
// ==============================|| Web3 CONTEXT & PROVIDER ||============================== //

export const Web3Provider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const { active, account, library, connector, activate, deactivate } = useWeb3React();
    useEffect(() => {
        if (window.ethereum) {
            alert('ok');
        } else {
            alert('Please Install Metamask!');
        }
    });

    const connectMetamask = async () => {
        try {
            await activate(injected);
        } catch (err) {
            console.log(`<:::Metamask Connection Failed:::>`, err);
        }
    };

    const connectWalletconnect = async () => {
        try {
            await activate(walletconnect);
        } catch (err) {
            console.log(`<:::Wallet Connect Failed Error:::>`, err);
        }
    };

    const disconnect = async () => {
        try {
            await deactivate();
        } catch (err) {
            console.log(`<:::Disconnection Failed:::>`, err);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                ...state,
                connectMetamask,
                connectWalletconnect,
                disconnect,
                active,
                account,
                library,
                connector,
                activate,
                deactivate
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

Web3Provider.propTypes = {
    children: PropTypes.node
};

export default Web3Context;
