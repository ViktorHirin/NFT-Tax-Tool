import { useState, useEffect } from 'react';

// material-ui
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Grid,
    CardContent,
    Button,
    LinearProgress
} from '@mui/material';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import Web3 from 'web3';
import { BSC_RPC_URL, ETHEREUM_RPC_URL, POLYGON_RPC_URL } from 'utils/connectors/RPC_URL';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import CustomDateTime from 'components/DateTime/CustomDateTime';
import { SNACKBAR_OPEN } from 'store/actions';
import { useDispatch } from 'react-redux';
import { convertUnixToNormal, convertNormalToUnix } from 'utils/Date/convertTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TotalRevenueCard from 'views/pages/Default/TotalRevenueCard';
import { useWeb3React } from '@web3-react/core';

// Import EventBus
import EventBus from 'hooks/eventBus';

// Import API
import { getNFTTransactionList, getTokenInfo } from 'utils/contract/binanceApi';
import { getEthNFTTxList } from 'utils/contract/etherscanApi';
import { getMaticNFTTxList } from 'utils/contract/polygonApi';
import { getTokenUsdPrice } from 'utils/contract/cryptocomApi';
import { WBNB } from 'utils/contract/contractAddresses';

let nativePrice = 0;

const getPrevYear = (_date) => {
    const prevYear = new Date(_date.valueOf() - 86400000 * 365);

    return prevYear;
};

// ==============================|| TABLE - STICKY HEADER ||============================== //

export default function StickyHeadTable({ isLoading }) {
    const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(Date.now());
    const [startStamp, setStartStamp] = useState(getPrevYear(Date.now()));
    const [txList, setTxList] = useState([]);
    const [progress, setProgress] = useState(0);
    const [taxList, setTaxList] = useState([
        {
            method: 'Sell',
            amount: 0
        },
        {
            method: 'Buy',
            amount: 0
        }
    ]);

    const initialStates = () => {
        setTxList([]);
        setTaxList([
            {
                method: 'Sell',
                amount: 0
            },
            {
                method: 'Buy',
                amount: 0
            }
        ]);
    };

    const dispatch = useDispatch();
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

    function gotoHashPage(_hash) {
        let URL_BY_HASH = '';
        if (chainId === 56) {
            URL_BY_HASH = `https://bscscan.com/tx/${_hash}`;
        } else if (chainId === 1) {
            URL_BY_HASH = `https://etherscan.io/tx/${_hash}`;
        } else if (chainId === 137) {
            URL_BY_HASH = `https://polygonscan.com/tx/${_hash}`;
        }
        window.open(URL_BY_HASH);
    }

    const columns = [
        {
            id: 'method',
            label: 'Method',
            minWidth: 100
        },
        {
            id: 'timestamp',
            label: 'TimeStamp',
            minWidth: 170,
            format: (value) => convertUnixToNormal(value)
        },
        {
            id: 'name',
            label: 'Token Name',
            minWidth: 170,
            align: 'center',
            format: (value) => value.toLocaleString('en-US')
        },
        {
            id: 'from',
            label: 'From',
            minWidth: 170,
            align: 'center',
            format: (value) => `${value.substring(0, 6)}...${value.substring(value.length - 4, value.length)}`
        },
        {
            id: 'to',
            label: 'To',
            minWidth: 170,
            align: 'center',
            format: (value) => `${value.substring(0, 6)}...${value.substring(value.length - 4, value.length)}`
        },
        {
            id: 'fee',
            label: 'Transaction Fee',
            minWidth: 150,
            align: 'center',
            format: (value) => <span style={{ color: '#F44336' }}>{value}</span>
        },
        {
            id: 'hash',
            label: 'Hash',
            minWidth: 170,
            align: 'center',
            format: (value) => (
                <Button variant="contained" color="secondary" startIcon={<CheckCircleOutlineIcon />} onClick={() => gotoHashPage(value)}>
                    {`${value.substring(0, 8)}...${value.substring(value.length - 6, value.length)}`}
                </Button>
            )
        }
    ];

    // table data
    function createData(_array, _address) {
        const tempData = [];
        if (_array.length > 0) {
            _array.forEach((tx, index) => {
                let temp = '';
                const tempfee = tx.gasUsed * (tx.gasPrice / 10 ** 18);
                if (tx.from === _address) {
                    temp = '-> Sell';
                } else if (tx.from === '0x0000000000000000000000000000000000000000') {
                    temp = '<- Mint';
                } else if (tx.to === '0x0000000000000000000000000000000000000000') {
                    temp = '<- Burn';
                } else {
                    temp = '<- Buy';
                }
                const transaction = {
                    method: temp,
                    timestamp: tx.timeStamp,
                    name: tx.tokenName,
                    from: tx.from,
                    to: tx.to,
                    fee: tempfee,
                    hash: tx.hash
                };
                tempData.push(transaction);
            });
        }
        setTxList(tempData);
        setLoading(false);
    }

    // Remove double data from Original Source
    function removeDoubleData(_array) {
        const data = _array.filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.hash).indexOf(obj.hash) === pos;
        });

        return data;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event?.target?.value);
        setPage(0);
    };

    const calcTotalRevenue = (_revenueArray, _gasArray) => {
        let valueSent = 0;
        let valueReceived = 0;
        let totalRevenue = 0;
        let totalGas = 0;
        let fees = 0;
        _revenueArray.forEach((tax) => {
            if (tax.type === 'Sell') {
                valueReceived += tax.amount;
            } else {
                valueSent += tax.amount;
            }
        });
        _gasArray.forEach((tax) => {
            const fee = tax.gasUsed * (tax.gasPrice / 10 ** 18);
            fees += fee;
        });
        totalGas = fees * nativePrice;
        totalRevenue = valueSent + valueReceived - totalGas;
        EventBus.dispatch('show-revenue', {
            sent: valueSent,
            received: valueReceived,
            revenue: totalRevenue,
            gas: totalGas,
            addr: account,
            taxdata: _revenueArray
        });
    };

    const listTaxData = (_array, _address, _arrForGas) => {
        const arrForGas = removeDoubleData(_arrForGas);
        const taxList = [];
        if (_array.length > 0) {
            _array.forEach((tx, index) => {
                let type = '';
                let value = '';
                if (tx.from === _address) {
                    type = 'Buy';
                    value = Math.abs(Number(tx.value)) * -1;
                } else if (tx.to === _address) {
                    type = 'Sell';
                    value = Math.abs(Number(tx.value));
                } else {
                    type = 'Buy';
                    value = Math.abs(Number(tx.value)) * -1;
                }
                const tax = {
                    method: type,
                    amount: (value * nativePrice) / 10 ** 18
                };
                taxList.push(tax);
            });
        }
        calcTotalRevenue(taxList, arrForGas);
        if (taxList.length >= 1) {
            setTaxList(taxList);
        } else {
            setTaxList([
                {
                    method: 'Sell',
                    amount: 0
                },
                {
                    method: 'Buy',
                    amount: 0
                }
            ]);
        }
    };

    useEffect(() => {
        EventBus.on('initialize', (e) => {
            initialStates();
        });
        EventBus.on('call-api', async (e) => {
            initialStates();
            console.log('<::chainId::>', e.chain);
            if (e.chain === 1) {
                nativePrice = await getTokenUsdPrice('ETH');
                console.log('<::etherPrice::>', nativePrice);
            } else if (e.chain === 56) {
                const bnb = await getTokenInfo(WBNB);
                nativePrice = bnb.result[0].tokenPriceUSD;
                console.log('<::BSC Price::>', nativePrice);
            } else if (e.chain === 137) {
                nativePrice = await getTokenUsdPrice('MATIC');
                console.log('<::Matic Price::>', nativePrice);
            }
        });
        EventBus.on('nft-transaction-by-address', async (e) => {
            setLoading(true);
            console.log('<::GetTransaction By Address::>', e.tokenAddress);
            let tempList = [];
            if (e.chain === 56) {
                tempList = await getNFTTransactionList(e.tokenAddress, e.address, startStamp);
                const results = [];
                const web3 = await new Web3(BSC_RPC_URL);
                for (let i = 0; i < tempList.length; i += 1) {
                    results.push(web3.eth.getTransaction(tempList[i].hash));
                }
                const datas = await Promise.all(results);
                const dataFiltered = removeDoubleData(datas);
                await listTaxData(dataFiltered, e.address, tempList);
                await createData(tempList, e.address);
            } else if (e.chain === 1) {
                tempList = await getEthNFTTxList(e.tokenAddress, e.address, startStamp);
                const results = [];
                const web3 = await new Web3(ETHEREUM_RPC_URL);
                for (let i = 0; i < tempList.length; i += 1) {
                    results.push(web3.eth.getTransaction(tempList[i].hash));
                }
                const datas = await Promise.all(results);
                const dataFiltered = removeDoubleData(datas);
                await listTaxData(dataFiltered, e.address, tempList);
                await createData(tempList, e.address);
            } else if (e.chain === 137) {
                tempList = await getMaticNFTTxList(e.tokenAddress, e.address, startStamp);
                const results = [];
                const web3 = await new Web3(POLYGON_RPC_URL);
                for (let i = 0; i < tempList.length; i += 1) {
                    results.push(web3.eth.getTransaction(tempList[i].hash));
                }
                const datas = await Promise.all(results);
                const dataFiltered = removeDoubleData(datas);
                await listTaxData(dataFiltered, e.address, tempList);
                await createData(tempList, e.address);
            }
        });
        EventBus.on('nft-all-transactions-by-address', async (e) => {
            console.log('<:::NFT All Transactions:::>', e);
            setLoading(true);
            const tempLists = [];
            if (e.chain === 56) {
                const dataFiltered = [];
                const web3 = await new Web3(BSC_RPC_URL);
                for (let j = 0; j < e.arrAddress.length; j += 1) {
                    const tempList = await getNFTTransactionList(e.arrAddress[j], e.address, startStamp);
                    const results = [];
                    for (let i = 0; i < tempList.length; i += 1) {
                        results.push(web3.eth.getTransaction(tempList[i].hash));
                    }
                    const temp = await Promise.all(results);
                    const tempFiltered = removeDoubleData(temp);
                    tempLists.push(...tempList);
                    dataFiltered.push(...tempFiltered);
                    const progressValue = (j * 100) / Number(e.arrAddress.length + 1);
                    setProgress(Number(progressValue));
                }
                await listTaxData(dataFiltered, e.address, tempLists);
                await createData(tempLists, e.address);
            } else if (e.chain === 1) {
                console.log('========Start=====');
                const dataFiltered = [];
                const web3 = await new Web3(ETHEREUM_RPC_URL);
                for (let j = 0; j < e.arrAddress.length; j += 1) {
                    const tempList = await getEthNFTTxList(e.arrAddress[j], e.address, startStamp);
                    const results = [];
                    for (let i = 0; i < tempList.length; i += 1) {
                        results.push(web3.eth.getTransaction(tempList[i].hash));
                    }
                    const temp = await Promise.all(results);
                    const tempFiltered = removeDoubleData(temp);
                    tempLists.push(...tempList);
                    dataFiltered.push(...tempFiltered);
                    const progressValue = (j * 100) / Number(e.arrAddress.length + 1);
                    setProgress(Number(progressValue));
                }
                await listTaxData(dataFiltered, e.address, tempLists);
                await createData(tempLists, e.address);
            } else if (e.chain === 137) {
                console.log('========Start=====');
                const dataFiltered = [];
                const web3 = await new Web3(POLYGON_RPC_URL);
                for (let j = 0; j < e.arrAddress.length; j += 1) {
                    const tempList = await getMaticNFTTxList(e.arrAddress[j], e.address, startStamp);
                    const results = [];
                    for (let i = 0; i < tempList.length; i += 1) {
                        results.push(web3.eth.getTransaction(tempList[i].hash));
                    }
                    const temp = await Promise.all(results);
                    const tempFiltered = removeDoubleData(temp);
                    tempLists.push(...tempList);
                    dataFiltered.push(...tempFiltered);
                    console.log(dataFiltered);
                    const progressValue = (j * 100) / Number(e.arrAddress.length + 1);
                    setProgress(Number(progressValue));
                }
                await listTaxData(dataFiltered, e.address, tempLists);
                await createData(tempLists, e.address);
            }
        });
        EventBus.on('change-time', (e) => {
            setStartStamp(e.value);
        });
    }, [startStamp]);

    return (
        <>
            {isLoading || loading ? (
                <>
                    {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
                    <SkeletonTotalGrowthBarChart />
                </>
            ) : (
                <>
                    <MainCard
                        content={false}
                        title="NFT Transactions"
                        secondary={<SecondaryAction link="https://next.material-ui.com/components/tables/" />}
                    >
                        <CardContent>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Start Time:</InputLabel>
                                            <CustomDateTime labeldate="Start-Time" initial={startStamp} disabledOpt={false} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>End Time:</InputLabel>
                                            <CustomDateTime labeldate="End-Time" initial={current} disabledOpt />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TotalRevenueCard txs={taxList} title="Tax List" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {txList.length > 0 && (
                                        <>
                                            <TableContainer sx={{ maxHeight: 440 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    {txList.length > 0 && (
                                                        <>
                                                            <TableHead>
                                                                <TableRow>
                                                                    {columns.map((column) => (
                                                                        <TableCell
                                                                            sx={{ py: 3 }}
                                                                            key={column.id}
                                                                            align={column.align}
                                                                            style={{ minWidth: column.minWidth }}
                                                                        >
                                                                            {column.label}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {txList
                                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    .map((row, index) => (
                                                                        <TableRow
                                                                            sx={{ py: 3 }}
                                                                            hover
                                                                            role="checkbox"
                                                                            tabIndex={-1}
                                                                            key={index}
                                                                        >
                                                                            {columns.map((column) => {
                                                                                const value = row[column.id];
                                                                                return (
                                                                                    <TableCell key={column.id} align={column.align}>
                                                                                        {column.format ? column.format(value) : value}
                                                                                    </TableCell>
                                                                                );
                                                                            })}
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </>
                                                    )}
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 25, 100]}
                                                component="div"
                                                count={txList.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </MainCard>
                </>
            )}
        </>
    );
}
