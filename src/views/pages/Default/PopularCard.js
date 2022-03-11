import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import Badge from '@mui/material/Badge';
import PaidIcon from '@mui/icons-material/Paid';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ApexPieChart from 'components/ApexPieChart';
import { SNACKBAR_OPEN } from 'store/actions';
import { useDispatch } from 'react-redux';

// Import API
import { getNFTList } from 'utils/contract/binanceApi';
import { getNFTListByAddress } from 'utils/contract/raribleApi';
import { getNftsByAddressonMatic } from 'utils/contract/moralisApi';

// Import EventBus
import EventBus from 'hooks/eventBus';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nftList, setNftList] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('');
    const [currentChainId, setCurrentChainId] = useState(null);
    const [nftAddrs, setNftAddrs] = useState([]);
    const [holdingChart, setHoldingChart] = useState({
        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                type: 'pie',
                width: 450,
                height: 450
            },
            labels: ['NFT A', 'NFT B', 'NFT C', 'NFT D', 'NFT E'],
            legend: {
                show: true,
                fontSize: '0.875rem',
                fontFamily: `'Roboto', sans-serif`,
                offsetX: 10,
                offsetY: 10,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 12,
                    height: 12,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 25,
                    vertical: 4
                }
            },
            responsive: [
                {
                    breakpoint: 450,
                    chart: {
                        width: 280,
                        height: 280
                    },
                    options: {
                        legend: {
                            show: false,
                            position: 'bottom'
                        }
                    }
                }
            ]
        }
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const initializeValues = () => {
        setNftList([]);
        setHoldingChart({
            series: [44, 55, 13, 43, 22],
            options: {
                chart: {
                    type: 'pie',
                    width: 450,
                    height: 450
                },
                labels: ['NFT A', 'NFT B', 'NFT C', 'NFT D', 'NFT E'],
                legend: {
                    show: true,
                    fontSize: '0.875rem',
                    fontFamily: `'Roboto', sans-serif`,
                    offsetX: 10,
                    offsetY: 10,
                    labels: {
                        useSeriesColors: false
                    },
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 5
                    },
                    itemMargin: {
                        horizontal: 25,
                        vertical: 4
                    }
                },
                responsive: [
                    {
                        breakpoint: 450,
                        chart: {
                            width: 280,
                            height: 280
                        },
                        options: {
                            legend: {
                                show: false,
                                position: 'bottom'
                            }
                        }
                    }
                ]
            }
        });
    };

    const callGetTransactionByAddress = (_tokenAddress) => {
        EventBus.dispatch('nft-transaction-by-address', { tokenAddress: _tokenAddress, address: currentAddress, chain: currentChainId });
    };

    const callGetAllTransactionsByAddress = (_arrNfts, _address, _chain) => {
        EventBus.dispatch('nft-all-transactions-by-address', { arrAddress: _arrNfts, address: _address, chain: _chain });
    };

    const validateData = (_data) => {
        if (_data.result.length === 0) {
            return false;
        }
        return true;
    };

    const setNotification = (_msg, _type) => {
        dispatch({
            type: SNACKBAR_OPEN,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            transition: 'SlideLeft',
            open: true,
            message: _msg,
            variant: 'alert',
            alertSeverity: _type,
            close: false
        });
    };

    const groupByContract = (_array, key) => {
        return _array.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const createArrayForNFTList = (obj) => {
        const nftList = [];
        Object.keys(obj).forEach((value) => {
            let nft = {};
            nft = {
                TokenAddress: value,
                TokenQuantity: obj[value].length,
                TokenName: obj[value][0].meta.name,
                TokenSymbol: obj[value][0].meta.name
            };
            nftList.push(nft);
        });
        return nftList;
    };

    const createArrayForMaticNFTs = (_arr) => {
        const nftList = [];
        _arr.forEach((element) => {
            let nft = {};
            nft = {
                TokenAddress: element.token_address,
                TokenQuantity: Number(element.amount),
                TokenName: element.name || 'NFT',
                TokenSymbol: element.symbol || element.name
            };
            nftList.push(nft);
        });
        return nftList;
    };

    const createNFTListByContract = (_array) => {
        const nftlist = groupByContract(_array, 'contract');
        const nftLists = createArrayForNFTList(nftlist);

        return nftLists;
    };

    useEffect(() => {
        EventBus.on('initialize', (e) => {
            initializeValues();
        });
        EventBus.on('call-api', async (e) => {
            console.log('<::CALL API in transaction::>', e.address);
            let nfts = [];
            setCurrentAddress(e.address);
            setCurrentChainId(e.chain);
            initializeValues();
            setLoading(true);
            if (e.chain === 56) {
                const tempInfo = await getNFTList(e.address);
                if (validateData(tempInfo)) {
                    nfts = tempInfo.result;
                    const holdingQuantityArr = [];
                    const holdingLabelArr = [];
                    const tokenAddrs = [];
                    nfts.forEach((nft) => {
                        holdingQuantityArr.push(Number(nft.TokenQuantity));
                        holdingLabelArr.push(nft.TokenName);
                        tokenAddrs.push(nft.TokenAddress);
                    });
                    setNftAddrs(tokenAddrs);
                    callGetAllTransactionsByAddress(tokenAddrs, e.address, e.chain);
                    setHoldingChart({
                        series: holdingQuantityArr,
                        options: {
                            chart: {
                                type: 'pie',
                                width: 500,
                                height: 500
                            },
                            labels: holdingLabelArr,
                            legend: {
                                show: true,
                                fontSize: '0.875rem',
                                fontFamily: `'Roboto', sans-serif`,
                                offsetX: 10,
                                offsetY: 10,
                                labels: {
                                    useSeriesColors: false
                                },
                                markers: {
                                    width: 12,
                                    height: 12,
                                    radius: 5
                                },
                                itemMargin: {
                                    horizontal: 25,
                                    vertical: 4
                                }
                            },
                            responsive: [
                                {
                                    breakpoint: 450,
                                    chart: {
                                        width: 280,
                                        height: 280
                                    },
                                    options: {
                                        legend: {
                                            show: false,
                                            position: 'bottom'
                                        }
                                    }
                                }
                            ]
                        }
                    });
                    setNftList(nfts);
                    setLoading(false);
                } else {
                    const error = tempInfo.message;
                    console.log('<::Failed Error::>', error);
                    setNotification(error, 'error');
                    setLoading(false);
                }
            } else if (e.chain === 1) {
                const arrNFTs = await getNFTListByAddress(e.address);
                nfts = createNFTListByContract(arrNFTs.items);
                console.log('nfts');
                const holdingQuantityArr = [];
                const holdingLabelArr = [];
                const tokenAddrs = [];
                nfts.forEach((nft) => {
                    holdingQuantityArr.push(Number(nft.TokenQuantity));
                    holdingLabelArr.push(nft.TokenName);
                    tokenAddrs.push(nft.TokenAddress);
                });
                setNftAddrs(tokenAddrs);
                callGetAllTransactionsByAddress(tokenAddrs, e.address, e.chain);
                setHoldingChart({
                    series: holdingQuantityArr,
                    options: {
                        chart: {
                            type: 'pie',
                            width: 500,
                            height: 500
                        },
                        labels: holdingLabelArr,
                        legend: {
                            show: true,
                            fontSize: '0.875rem',
                            fontFamily: `'Roboto', sans-serif`,
                            offsetX: 10,
                            offsetY: 10,
                            labels: {
                                useSeriesColors: false
                            },
                            markers: {
                                width: 12,
                                height: 12,
                                radius: 5
                            },
                            itemMargin: {
                                horizontal: 25,
                                vertical: 4
                            }
                        },
                        responsive: [
                            {
                                breakpoint: 450,
                                chart: {
                                    width: 280,
                                    height: 280
                                },
                                options: {
                                    legend: {
                                        show: false,
                                        position: 'bottom'
                                    }
                                }
                            }
                        ]
                    }
                });
                setNftList(nfts);
                setLoading(false);
            } else if (e.chain === 137) {
                const arrMaticNft = await getNftsByAddressonMatic(e.address);
                nfts = createArrayForMaticNFTs(arrMaticNft);
                console.log(nfts);
                const holdingQuantityArr = [];
                const holdingLabelArr = [];
                const tokenAddrs = [];
                nfts.forEach((nft) => {
                    holdingQuantityArr.push(Number(nft.TokenQuantity));
                    holdingLabelArr.push(nft.TokenName);
                    tokenAddrs.push(nft.TokenAddress);
                });
                setNftAddrs(tokenAddrs);
                callGetAllTransactionsByAddress(tokenAddrs, e.address, e.chain);
                setHoldingChart({
                    series: holdingQuantityArr,
                    options: {
                        chart: {
                            type: 'pie',
                            width: 500,
                            height: 500
                        },
                        labels: holdingLabelArr,
                        legend: {
                            show: true,
                            fontSize: '0.875rem',
                            fontFamily: `'Roboto', sans-serif`,
                            offsetX: 10,
                            offsetY: 10,
                            labels: {
                                useSeriesColors: false
                            },
                            markers: {
                                width: 12,
                                height: 12,
                                radius: 5
                            },
                            itemMargin: {
                                horizontal: 25,
                                vertical: 4
                            }
                        },
                        responsive: [
                            {
                                breakpoint: 450,
                                chart: {
                                    width: 280,
                                    height: 280
                                },
                                options: {
                                    legend: {
                                        show: false,
                                        position: 'bottom'
                                    }
                                }
                            }
                        ]
                    }
                });
                console.log(holdingQuantityArr, holdingLabelArr);
                setNftList(nfts);
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            {isLoading || loading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">NFT Holdings</Typography>
                                    </Grid>
                                    <Grid item>
                                        <ApexPieChart chartoptions={holdingChart.options} chartseries={holdingChart.series} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <PerfectScrollbar style={{ height: 400, paddingTop: 10 }}>
                                    {nftList &&
                                        nftList.length > 0 &&
                                        nftList.map((nft, index) => (
                                            <div key={`popularCard${index}`}>
                                                <Grid container direction="column">
                                                    <Grid item>
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item>
                                                                <Typography variant="subtitle1" color="inherit">
                                                                    {nft.TokenName}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Grid container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1" color="inherit">
                                                                            <Badge badgeContent={nft.TokenQuantity} color="error">
                                                                                <PaidIcon color="action" />
                                                                            </Badge>
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Avatar
                                                                            variant="rounded"
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '5px',
                                                                                backgroundColor: 'transparent',
                                                                                color: theme.palette.success.dark,
                                                                                ml: 2
                                                                            }}
                                                                        >
                                                                            <AddToHomeScreenIcon
                                                                                fontSize="large"
                                                                                color="inherit"
                                                                                onClick={() => {
                                                                                    callGetTransactionByAddress(nft.TokenAddress);
                                                                                }}
                                                                            />
                                                                        </Avatar>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                                            {nft.TokenSymbol}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Divider sx={{ my: 1.5 }} />
                                            </div>
                                        ))}
                                    {nftList.length === 0 && (
                                        <>
                                            <Grid container direction="column">
                                                <Grid item>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item>
                                                            <Typography variant="subtitle1" color="inherit">
                                                                Token Name
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Grid container alignItems="center" justifyContent="space-between">
                                                                <Grid item>
                                                                    <Typography variant="subtitle1" color="inherit">
                                                                        Token Quantity
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        sx={{
                                                                            width: 32,
                                                                            height: 32,
                                                                            borderRadius: '5px',
                                                                            backgroundColor: 'transparent',
                                                                            color: theme.palette.success.dark,
                                                                            ml: 2
                                                                        }}
                                                                    >
                                                                        <AddToHomeScreenIcon fontSize="large" color="inherit" />
                                                                    </Avatar>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                                        Token Symbol
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Divider sx={{ my: 1.5 }} />
                                        </>
                                    )}
                                </PerfectScrollbar>
                            </Grid>
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
