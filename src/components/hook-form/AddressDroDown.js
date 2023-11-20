import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";

// ----------------------------------------------------------------------

AddressDropDown.propTypes = {
  name: PropTypes.string,
};

export default function AddressDropDown({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <TextField
          {...other}
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={value}
          defaultValue={other.defaultValue}
          onChange={(event) => {
            onChange(event.target.value);
            other?.onChangeFunc(event.target.value)
          }}
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
