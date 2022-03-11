import { useState } from 'react';

// material-ui
import { InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import EventBus from 'hooks/eventBus';

// assets
import DateRangeIcon from '@mui/icons-material/DateRange';

// ==============================|| CUSTOM DATETIME ||============================== //

const CustomDateTime = ({ labeldate, initial, disabledOpt }) => {
    const [value, setValue] = useState(initial);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    EventBus.dispatch('change-time', { value: newValue });
                }}
                disabled={disabledOpt}
                label={labeldate}
                onError={console.log}
                minDate={new Date('2018-01-01T00:00')}
                inputFormat="yyyy/MM/dd hh:mm a"
                mask="___/__/__ __:__ _M"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <DateRangeIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};

export default CustomDateTime;
