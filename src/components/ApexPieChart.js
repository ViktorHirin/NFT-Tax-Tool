import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// ==============================|| PIE CHART ||============================== //

const ApexPieChart = ({ chartoptions, chartseries }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const backColor = theme.palette.background.paper;

    const [series] = useState(chartseries);
    const [options, setOptions] = useState(chartoptions);

    const secondary = theme.palette.secondary.main;
    const primaryMain = theme.palette.primary.main;
    const successDark = theme.palette.success.dark;
    const error = theme.palette.error.main;
    const warningDark = theme.palette.warning.dark;
    const orangeDark = theme.palette.orange.dark;

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [successDark, error, warningDark, primaryMain, orangeDark, secondary],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            },
            stroke: {
                colors: [backColor]
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navType, primary, darkLight, grey200, backColor, secondary, primaryMain, successDark, error, warningDark, orangeDark]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="pie" />
        </div>
    );
};

export default ApexPieChart;
