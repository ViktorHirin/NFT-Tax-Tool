import { forwardRef, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Grid } from '@mui/material';
import UserProfileCard from 'ui-component/cards/UserProfileCard';
import BSC from 'assets/images/icons/Binance-BNB-Icon-Logo.wine.svg';
import Ethereum from 'assets/images/icons/ethereum.svg';
import Polygon from 'assets/images/icons/polygon.svg';
import EventBus from 'hooks/eventBus';

// animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const polygonNetwork = {
    id: '#9Card_Madyson',
    avatar: Polygon,
    profile: 'polygon.jpg',
    name: 'Polygon (Matic)',
    curId: '137'
};
const bscNetwork = {
    id: '#9Card_Madyson',
    avatar: BSC,
    profile: 'polygon.jpg',
    name: 'Binance Smart Chain',
    curId: '56'
};
const ethereumNetwork = {
    id: '#9Card_Madyson',
    avatar: Ethereum,
    profile: 'polygon.jpg',
    name: 'Ethereum',
    curId: '1'
};

// ===============================|| UI DIALOG - SLIDE ANIMATION ||=============================== //

export default function AlertDialogSlide() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        EventBus.on('switch-network', (e) => {
            handleClickOpen();
        });
    }, []);

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title1"
                aria-describedby="alert-dialog-slide-description1"
            >
                <DialogTitle id="alert-dialog-slide-title1">Which Network are you going to switch now?</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <DialogContentText id="alert-dialog-slide-description1">
                                <UserProfileCard {...ethereumNetwork} />
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <DialogContentText id="alert-dialog-slide-description1">
                                <UserProfileCard {...bscNetwork} />
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <DialogContentText id="alert-dialog-slide-description1">
                                <UserProfileCard {...polygonNetwork} />
                            </DialogContentText>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ pr: 2.5 }}>
                    <Button variant="contained" size="small" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
