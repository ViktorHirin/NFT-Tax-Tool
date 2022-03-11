// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = () => (
    <Card>
        <CardContent>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height={60} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Skeleton variant="rectangular" height={40} />
                        </Grid>
                        <Grid item xs={6}>
                            <Skeleton variant="rectangular" height={40} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={60} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={20} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={20} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={20} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={20} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={70} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default TotalGrowthBarChart;
