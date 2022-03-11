import PropTypes from 'prop-types';

// material-ui
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const TotalRevenueCard = ({ title, txs }) => {
    const successSX = { color: 'success.dark' };
    const errorSX = { color: 'error.main' };

    return (
        <MainCard title={title} content={false}>
            <PerfectScrollbar style={{ height: 400 }}>
                <List
                    component="nav"
                    aria-label="main mailbox folders"
                    sx={{
                        '& svg': {
                            width: 32,
                            my: -0.75,
                            ml: -0.75,
                            mr: 0.75
                        }
                    }}
                >
                    {txs &&
                        txs.length > 0 &&
                        txs.map((tx, index) => {
                            if (tx.method === 'Sell') {
                                return (
                                    <div key={`revenue${index}`}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ArrowDropUpIcon sx={successSX} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <span>{tx.method}</span>
                                                        <Typography sx={successSX}>+ ${tx.amount}</Typography>
                                                    </Stack>
                                                }
                                            />
                                        </ListItemButton>
                                        <Divider />
                                    </div>
                                );
                            }
                            if (tx.method !== 'Sell') {
                                return (
                                    <div key={`revenue${index}`}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ArrowDropDownIcon sx={errorSX} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <span>{tx.method}</span>
                                                        <Typography sx={errorSX}> $ {tx.amount}</Typography>
                                                    </Stack>
                                                }
                                            />
                                        </ListItemButton>
                                        <Divider />
                                    </div>
                                );
                            }
                            return <></>;
                        })}
                </List>
            </PerfectScrollbar>
        </MainCard>
    );
};

TotalRevenueCard.propTypes = {
    title: PropTypes.string
};

export default TotalRevenueCard;
