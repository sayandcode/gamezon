import { useField } from 'formik';

function extendWithFormik(
  OriginalComponent,
  { onChangeGivesValue = false } = {}
) {
  return function extendedComponent({ helperText, ...restProps }) {
    const [{ onChange, ...restField }, meta] = useField(restProps);

    /* HANDLE CHANGE */
    // Formik expects an object of the following shape, which conforms to the event object:
    // 👉 expectedObj: { target: { id, name, value: 'phoneNumber' } }
    // to be passed into onChange.
    // However some components provide the new value, instead of the event object
    // and hence we handle those by providing the expected object shape to onChange
    const handleChange = onChangeGivesValue
      ? (newVal) => {
          const expectedObj = {
            target: { id: restProps.id, name: restProps.name, value: newVal },
          };
          onChange(expectedObj);
        }
      : onChange;

    /* HANDLE ERROR STATES */
    const error = meta.touched && meta.error;
    // If there are multiple errors in the form of an object, show each error from object
    const errorText = isObject(error) ? Object.values(error).join('\n') : error;
    // If there is explicit helperText, show it first.
    // Then on any errors after touched, show the error message
    const finalHelperText = errorText || helperText;

    return (
      <OriginalComponent
        onChange={handleChange}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restField}
        error={!!errorText}
        helperText={finalHelperText}
      />
    );
  };
}

function isObject(obj) {
  return obj instanceof Object && !(obj instanceof Array);
}

export default extendWithFormik;
