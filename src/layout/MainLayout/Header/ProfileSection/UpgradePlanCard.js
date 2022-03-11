// material-ui
import { useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { Button, Card, CardContent, Grid, Stack, Typography, Tooltip, IconButton } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SNACKBAR_OPEN } from 'store/actions';
import { useWeb3React } from '@web3-react/core';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// styles
const CardStyle = styled(Card)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.warning.light,
    marginTop: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '19px solid ',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.warning.main,
        borderRadius: '50%',
        top: '65px',
        right: '-150px'
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '3px solid ',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.warning.main,
        borderRadius: '50%',
        top: '145px',
        right: '-70px'
    }
}));

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

const UpgradePlanCard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React();

    return (
        <CardStyle>
            <CardContent>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h4">My Wallet</Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="subtitle1"
                            color={theme.palette.mode === 'dark' ? 'textSecondary' : 'grey.900'}
                            sx={{ opacity: theme.palette.mode === 'dark' ? 1 : 0.6 }}
                        >
                            ChainID : {chainId}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color={theme.palette.mode === 'dark' ? 'textSecondary' : 'grey.900'}
                            sx={{ opacity: theme.palette.mode === 'dark' ? 1 : 0.6 }}
                        >
                            Network : {chainId === 1 ? 'Ethereum' : chainId === 56 ? 'Binance Smart Chain' : 'Polygon (Matic)'}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color={theme.palette.mode === 'dark' ? 'textSecondary' : 'grey.900'}
                            sx={{ opacity: theme.palette.mode === 'dark' ? 1 : 0.6 }}
                        >
                            Address : {`${account.substring(0, 20)}...${account.substring(account.length - 9, account.length)}`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row">
                            <AnimateButton>
                                <CopyToClipboard
                                    text={account}
                                    onCopy={() =>
                                        dispatch({
                                            type: SNACKBAR_OPEN,
                                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                            transition: 'SlideLeft',
                                            open: true,
                                            message: `Address is copied!`,
                                            variant: 'alert',
                                            alertSeverity: 'success',
                                            close: false
                                        })
                                    }
                                >
                                    <Tooltip title="Copy Address">
                                        <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }}>
                                            Copy Address
                                        </Button>
                                    </Tooltip>
                                </CopyToClipboard>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </CardStyle>
    );
};

export default UpgradePlanCard;
