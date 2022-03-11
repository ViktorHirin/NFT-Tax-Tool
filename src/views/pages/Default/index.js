import { useEffect, useState } from 'react';
// material-ui
import { Grid, Typography, useMediaQuery, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Import EventBus
import EventBus from 'hooks/eventBus';
import ReactExport from 'react-export-excel-fixed-xlsx';

// project imports
import { gridSpacing } from 'store/constant';
import TableStickyHead from 'components/TableStickyHead';
import PopularCard from './PopularCard';
import MainCard from 'ui-component/cards/MainCard';
import { IconShare, IconAccessPoint, IconCircles, IconCreditCard } from '@tabler/icons';
import RevenueCard from 'ui-component/cards/Skeleton/RevenueCard';
import DialogSlide from 'ui-elements/advance/UIDialog/AlertDialogSlide';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [loading, setRLoading] = useState(false);
    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));
    const blockSX = {
        p: 2.5,
        borderLeft: '1px solid ',
        borderBottom: '1px solid ',
        borderLeftColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200],
        borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200]
    };
    const [sent, setSent] = useState(0);
    const [received, setReceived] = useState(0);
    const [fee, setFee] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [dataForExcel, setDataForExcel] = useState([
        {
            address: '',
            sent: 0,
            received: 0,
            trading_fee: 0,
            revenue: 0
        }
    ]);
    const [dataForExcel2, setDataForExcel2] = useState([
        {
            method: '',
            amount: ''
        }
    ]);

    const fixedPriceDecimals = (_price) => {
        const fixed = Number(_price).toFixed(4);
        return fixed;
    };

    const initialStates = () => {
        setSent(0);
        setReceived(0);
        setFee(0);
        setRevenue(0);
    };

    useEffect(() => {
        setLoading(false);
        EventBus.on('initialize', (e) => {
            initialStates();
        });
        EventBus.on('show-revenue', (e) => {
            console.log('taxdata', e.taxdata);
            initialStates();
            setRLoading(true);
            setSent(Math.abs(fixedPriceDecimals(e.sent)));
            setRevenue(fixedPriceDecimals(e.revenue));
            setFee(fixedPriceDecimals(e.gas));
            setReceived(fixedPriceDecimals(e.received));
            setDataForExcel2(e.taxdata);
            setDataForExcel([
                {
                    address: e.addr,
                    sent: Math.abs(fixedPriceDecimals(e.sent)),
                    received: fixedPriceDecimals(e.received),
                    trading_fee: fixedPriceDecimals(e.gas),
                    revenue: fixedPriceDecimals(e.revenue)
                }
            ]);
            setRLoading(false);
        });
    }, []);

    return (
        <>
            <DialogSlide />
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={8}>
                    <TableStickyHead isLoading={isLoading} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <MainCard
                                        content={false}
                                        sx={{
                                            '& svg': {
                                                width: 50,
                                                height: 50,
                                                color: theme.palette.secondary.main,
                                                borderRadius: '14px',
                                                p: 1.25,
                                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'primary.light'
                                            }
                                        }}
                                    >
                                        {loading ? (
                                            <RevenueCard />
                                        ) : (
                                            <>
                                                <Grid container alignItems="center" spacing={0}>
                                                    <Grid item xs={12} sm={6} sx={blockSX}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={1}
                                                            justifyContent={matchDownXs ? 'space-between' : 'center'}
                                                        >
                                                            <Grid item>
                                                                <IconShare stroke={1.5} />
                                                            </Grid>
                                                            <Grid item sm zeroMinWidth>
                                                                <Typography variant="h5" align="center">
                                                                    $ {sent}
                                                                </Typography>
                                                                <Typography variant="subtitle2" align="center">
                                                                    Sent
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} sx={blockSX}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={1}
                                                            justifyContent={matchDownXs ? 'space-between' : 'center'}
                                                        >
                                                            <Grid item>
                                                                <IconAccessPoint stroke={1.5} />
                                                            </Grid>
                                                            <Grid item sm zeroMinWidth>
                                                                <Typography variant="h5" align="center">
                                                                    $ {received}
                                                                </Typography>
                                                                <Typography variant="subtitle2" align="center">
                                                                    Received
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container alignItems="center" spacing={0}>
                                                    <Grid item xs={12} sm={6} sx={blockSX}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={1}
                                                            justifyContent={matchDownXs ? 'space-between' : 'center'}
                                                        >
                                                            <Grid item>
                                                                <IconCircles stroke={1.5} />
                                                            </Grid>
                                                            <Grid item sm zeroMinWidth>
                                                                <Typography variant="h5" align="center">
                                                                    $ {fee}
                                                                </Typography>
                                                                <Typography variant="subtitle2" align="center">
                                                                    Trading Fee
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} sx={blockSX}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={1}
                                                            justifyContent={matchDownXs ? 'space-between' : 'center'}
                                                        >
                                                            <Grid item>
                                                                <IconCreditCard stroke={1.5} />
                                                            </Grid>
                                                            <Grid item sm zeroMinWidth>
                                                                <Typography variant="h5" align="center">
                                                                    $ {revenue}
                                                                </Typography>
                                                                <Typography variant="subtitle2" align="center">
                                                                    Revenue
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container alignItems="center" spacing={0}>
                                                    <Grid item xs={12} sm={12} sx={blockSX}>
                                                        {Number(revenue) !== 0 && (
                                                            <ExcelFile
                                                                element={
                                                                    <Button variant="outlined" disabled={Number(revenue) === 0}>
                                                                        Download Data
                                                                    </Button>
                                                                }
                                                                filename="RevenueData"
                                                            >
                                                                <ExcelSheet data={dataForExcel} name="Revenue">
                                                                    <ExcelColumn label="Address" value="address" />
                                                                    <ExcelColumn label="Sent ($)" value="sent" />
                                                                    <ExcelColumn label="Received ($)" value="received" />
                                                                    <ExcelColumn label="Trading Fee ($)" value="trading_fee" />
                                                                    <ExcelColumn label="Revenue ($)" value="revenue" />
                                                                </ExcelSheet>
                                                                <ExcelSheet data={dataForExcel2} name="Tax Data">
                                                                    <ExcelColumn label="Method" value="method" />
                                                                    <ExcelColumn label="Amount ($)" value="amount" />
                                                                </ExcelSheet>
                                                            </ExcelFile>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                    </MainCard>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <PopularCard isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
