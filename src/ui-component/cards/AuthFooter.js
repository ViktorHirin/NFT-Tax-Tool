// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://zapper.fi/" target="_blank" underline="hover">
            zapper.fi
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://www.nansen.ai/" target="_blank" underline="hover">
            www.nansen.ai
        </Typography>
    </Stack>
);

export default AuthFooter;
