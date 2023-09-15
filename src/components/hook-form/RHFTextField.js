import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextareaAutosize } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({ name, ...other }) {
  const { control } = useFormContext();

  if (other?.inputType === 'dropDown') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            {...other}
            fullWidth
            select
            SelectProps={{ native: true }}
            variant="outlined"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!error}
            helperText={error?.message}
            disabled={other.disabled}
          >
            {other.dropDownData?.map((option, key) => (
              <option key={key} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        )}
      />
    );
  }

  if (other?.inputType === 'textarea') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextareaAutosize
            {...field}
            style={{width: '100%', fontSize: 16}}
            value={field.value}
            error={!!error}
            helperText={error?.message}
            {...other}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} fullWidth value={field.value} error={!!error} helperText={error?.message} {...other}  />
      )}
    />
  );
}
