import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import dayjs from "dayjs";

// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDatePicker({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <>
    {other?.type === 'date' ?
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        value={dayjs(value)}
                        onChange={onChange}
                        renderInput={(params) => <TextField {...params} />}
                        {...other}
                    />
                </LocalizationProvider>
            )}
        />
        :
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <TextField
                        {...field}
                        fullWidth
                        error={!!error}
                        type="time"
                        sx={{ width: 250 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={field.onChange}
                        {...other}
                    />
                </LocalizationProvider>
            )}
        />
    }
</>
  );
}
