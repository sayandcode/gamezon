import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { object as YupObject, string as YupString } from 'yup';
import { useContext } from 'react';
import extendWithFormik from '../../utlis/FormHelpers/extendWithFormik';
import MuiPhoneNumberInput from '../MuiPhoneNumberInput';
import {
  getCscObjShape,
  getCityOptions,
  getCountryOptions,
  getStateOptions,
} from './countryStateCityHelpers';
import MuiAutocomplete from '../MuiAutocomplete';
import { UserContext } from '../../utlis/Contexts/UserData/UserContext';
import '../../utlis/FormHelpers/newYupMethods';
import Address from './addressClass';

const FormikTextField = extendWithFormik(TextField);
const FormikAutocomplete = extendWithFormik(MuiAutocomplete, {
  onChangeGivesValue: true,
});
const FormikPhoneNumber = extendWithFormik(MuiPhoneNumberInput, {
  onChangeGivesValue: true,
});

const defaultInitialFormValues = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  country: null,
  state: null,
  city: null,
  phoneNumber: '',
};

/* NOTE: Validation schema is statically set at the beginning. */
/* The only dynamic control we have is in the test and addMethod(which is a wrapper) */
const validationSchema = YupObject({
  firstName: YupString().required("Can't be empty"),
  lastName: YupString().required("Can't be empty"),
  addressLine1: YupString().required('Where will we deliver?'),
  addressLine2: YupString(),
  country: YupObject(getCscObjShape())
    .nullable()
    .required("Country can't be empty"),

  state: YupObject()
    .isFromOptionsProvidedBy(['country'], getStateOptions, {
      required: 'State cannot be empty',
    })
    .shape(getCscObjShape()),
  city: YupObject()
    .isFromOptionsProvidedBy(['country', 'state'], getCityOptions, {
      required: 'City cannot be empty',
    })
    .shape(getCscObjShape({ benefactor: false })),
  phoneNumber: YupString()
    .isPossiblePhoneNumber('Enter a valid phone number')
    .required('How will we call you?'),
});

const placeholders = {
  firstName: 'Dwight',
  lastName: 'Schrute',
  addressLine1: 'Dunder Mifflin Scranton, Scranton Business Park',
  addressLine2: '1725 Slough Avenue, Scranton',
  country: 'United States',
  state: 'Pennsylvania',
  city: 'Scranton',
  phoneNumber: '+1 570 343 3400',
};

function AddressFormModal({
  open,
  onClose: handleClose,
  edit: addressToBeEdited,
}) {
  const { addressList } = useContext(UserContext);

  // If the edit prop is passed with an Address, then fetch the initial value of the form from it.
  const initialFormValues =
    addressToBeEdited?.content || defaultInitialFormValues;

  const dialogTitleText = addressToBeEdited
    ? 'Edit address'
    : 'Add new address';

  const handleSubmit = (formValues) => {
    const newAddress = new Address(formValues);
    if (addressToBeEdited) addressList.edit(addressToBeEdited, newAddress);
    else addressList.add(newAddress);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { p: 1, bgcolor: 'grey.200', position: 'relative' } }}
    >
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values: formValues, setFieldValue }) => {
          const selectedCountry = formValues.country;
          const selectedState = formValues.state;
          const selectedCity = formValues.city;

          const countryOptions = getCountryOptions();
          const stateOptions = getStateOptions(selectedCountry);
          const cityOptions = getCityOptions(selectedCountry, selectedState);

          /* HANDLE BACKTRACKING ERRORS  */
          // Sometimes the user selects an option, and then goes back to edit a previous field, rendering
          // the selected option invalid. So every time this happens, programmatically set the field to null,
          if (selectedState !== null && stateOptions.length === 0)
            setFieldValue('state', null);
          if (selectedCity !== null && cityOptions.length === 0)
            setFieldValue('city', null);

          return (
            <Form>
              <DialogTitle>{dialogTitleText}</DialogTitle>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: (theme) => theme.spacing(2),
                  right: (theme) => theme.spacing(2),
                }}
                onClick={handleClose}
              >
                <Close />
              </IconButton>
              <DialogContent>
                <Stack direction="row" spacing={2}>
                  <FormikTextField
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    size="small"
                    fullWidth
                    placeholder={placeholders.firstName}
                  />
                  <FormikTextField
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    placeholder={placeholders.lastName}
                    fullWidth
                    size="small"
                  />
                </Stack>
                <FormikTextField
                  label="Address Line 1"
                  id="addressLine1"
                  name="addressLine1"
                  placeholder={placeholders.addressLine1}
                  size="small"
                  fullWidth
                />
                <FormikTextField
                  label="Address Line 2"
                  id="addressLine2"
                  name="addressLine2"
                  placeholder={placeholders.addressLine2}
                  size="small"
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <FormikAutocomplete
                    id="country"
                    name="country"
                    placeholder={placeholders.country}
                    label="Country"
                    options={countryOptions}
                    fullWidth
                    size="small"
                  />
                  <FormikAutocomplete
                    id="state"
                    name="state"
                    placeholder={placeholders.state}
                    label="State"
                    disabled={!selectedCountry || stateOptions.length === 0}
                    options={stateOptions}
                    size="small"
                    fullWidth
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormikAutocomplete
                    id="city"
                    name="city"
                    placeholder={placeholders.city}
                    label="City"
                    disabled={!selectedState}
                    options={cityOptions}
                    size="small"
                    fullWidth
                  />
                  <FormikPhoneNumber
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder={placeholders.phoneNumber}
                    label="Phone Number"
                    size="small"
                    fullWidth
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}

AddressFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  edit: PropTypes.instanceOf(Address),
};

AddressFormModal.defaultProps = {
  open: false,
  onClose: () => {},
  edit: undefined,
};

export default AddressFormModal;
