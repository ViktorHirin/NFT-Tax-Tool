import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { injected, walletconnect, walletlink } from 'utils/connectors/WalletConnector';
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { URI_AVAILABLE, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { useNavigate } from 'react-router-dom';
import config from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import Metamask from 'assets/images/icons/metamask.svg';
import Walletconnect from 'assets/images/icons/walletconnect.svg';
import Coinbase from 'assets/images/icons/coinbase.svg';

// ============================|| Wallet - LOGIN ||============================ //

const WalletLogin = ({ loginProp, ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const { active, account, library, connector, activate, deactivate, error, chainId } = useWeb3React();
    const navigate = useNavigate();

    const connectMetamask = async () => {
        try {
            await activate(injected);
            console.log(active);
            navigate(config.defaultPath, { replace: true });
        } catch (err) {
            console.log(`<:::Metamask Connection Failed:::>`, err);
        }
    };

    const connectWalletconnect = async () => {
        try {
            await activate(walletconnect);
            navigate(config.defaultPath, { replace: true });
        } catch (err) {
            console.log(`<:::Wallet Connect Failed Error:::>`, err);
        }
    };

    const connectWalletLink = async () => {
        try {
            await activate(walletlink);
            navigate(config.defaultPath, { replace: true });
        } catch (err) {
            console.log(`<:::Wallet Connect Failed Error:::>`, err);
        }
    };

    function getErrorMessage(error) {
        let errorMsg = '';
        if (error instanceof NoEthereumProviderError) {
            errorMsg = 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
        } else if (error instanceof UnsupportedChainIdError) {
            errorMsg = 'You are connected to an unsupported network.';
        } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
            errorMsg = 'Please authorize this website to access your Ethereum account.';
        } else {
            console.error(error);
            errorMsg = 'An unknown error occurred. Check the console for more details.';
        }
        return errorMsg;
    }

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={connectMetamask}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Metamask} alt="metamask" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Metamask
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={connectWalletconnect}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Walletconnect} alt="wc" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Wallet Connect
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={connectWalletLink}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Coinbase} alt="wc" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Coinbase Wallet
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
        </>
    );
};

WalletLogin.propTypes = {
    loginProp: PropTypes.number
};

export default WalletLogin;
