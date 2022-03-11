import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';

// project imports
import Avatar from '../extended/Avatar';
import { gridSpacing } from 'store/constant';
import { switchNetwork } from 'utils/contract/web3Api';

const avatarImage = require.context('assets/images/profile', true);

// ==============================|| USER PROFILE CARD ||============================== //

const UserProfileCard = ({ avatar, name, profile, curId }) => {
    const theme = useTheme();
    const imageProfile = profile && avatarImage(`./${profile}`).default;
    const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React();

    const switchNetworks = (_chainId, chainIdDecimal) => {
        switchNetwork(library, _chainId, chainIdDecimal);
    };

    const chainIdinHex = (_chainId) => {
        let tempId = '0x1';
        if (_chainId === '1') {
            tempId = '0x1';
        } else if (_chainId === '56') {
            tempId = '0x38';
        } else {
            tempId = '0x89';
        }
        return tempId;
    };

    return (
        <Card
            sx={{
                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
                borderColor: theme.palette.grey[100],
                textAlign: 'center'
            }}
        >
            <CardMedia component="img" image={imageProfile} title="Slider5 image" sx={{ height: '125px' }} />
            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Avatar alt={name} src={avatar} sx={{ width: 72, height: 72, m: '-50px auto 0' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} alignItems="center">
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h4">{name}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {chainId === Number(curId) ? (
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : 'success.light',
                                            color: 'success.dark'
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        label="Disconnected"
                                        size="small"
                                        sx={{
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : 'error.light',
                                            color: 'error.dark'
                                        }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => switchNetworks(chainIdinHex(curId), curId)}
                            disabled={chainId === Number(curId)}
                        >
                            Switch Network
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

UserProfileCard.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
    profile: PropTypes.string,
    curId: PropTypes.string
};

export default UserProfileCard;
