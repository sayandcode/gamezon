import { Add as AddIcon } from '@mui/icons-material';
import { alpha, Box, Button, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { UserContext } from '../../utlis/Contexts/UserData/UserContext';
import ScrollingSelect from '../ScrollingSelect/ScrollingSelect';
import Address from './addressClass';
import AddressFormModal from './AddressFormModal';

function AddressSelector({
  onSelect: handleSelect,
  name: wrapperComponentName,
}) {
  /* DATA */
  const { addressList } = useContext(UserContext);
  const addresses = addressList.contents;

  /* STATE */
  const [addressModalProps, setAddressModalProps] = useState({
    open: false,
    edit: null,
  });

  /* RUNTIME CALCULATIONS */
  const readOnly = !handleSelect;

  // `value=null` fixes the selected address as nothing; i.e. the address cannot be selected.
  // But `value = undefined` makes the component store the state internally like an HTML radio storing its state.
  // So when we use the AddressSelector as an input, the value is left as undefined, which allows us to access the
  // selected address using the onChange/onSelect prop
  const addressValue = readOnly ? null : undefined;

  // `handleChange=null` simply ignores the change event, which is the desired behaviour for a readOnly AddressSelector
  const handleChange = readOnly
    ? null
    : (event) => {
        const selectedAddressID = event.target.value;
        const selectedAddress = addressList.find(selectedAddressID);
        // lets follow the standard format of event.target.value, and event.target.name
        const returnVal = {
          target: { value: selectedAddress, name: wrapperComponentName },
        };
        handleSelect(returnVal);
      };

  /* EVENT HANDLERS */
  const handleEdit = (address) => {
    setAddressModalProps({ open: true, edit: address });
  };
  const handleRemove = (address) => {
    addressList.remove(address);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {addresses.length > 0 ? (
        <ScrollingSelect
          name={wrapperComponentName}
          value={addressValue}
          onChange={handleChange}
        >
          {addresses.map((address) => (
            <AddressItem
              address={address}
              value={address.id}
              id={address.id}
              key={address.id}
              readOnly={readOnly}
              edit={handleEdit}
              remove={handleRemove}
            />
          ))}
        </ScrollingSelect>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: '250px', bgcolor: 'grey.100' }}
        >
          <Typography variant="h5" component="h3" align="center">
            No addresses to show
          </Typography>
        </Stack>
      )}

      <Button
        variant="contained"
        size="large"
        color="primary"
        sx={{
          borderRadius: (theme) => theme.shape.borderRadius * 2,
          position: 'absolute',
          bottom: (theme) => theme.spacing(3),
          right: (theme) => theme.spacing(5),
          zIndex: 20,
        }}
        endIcon={<AddIcon />}
        onClick={() => setAddressModalProps({ open: true, edit: null })}
      >
        New Address
      </Button>
      <AddressFormModal
        open={addressModalProps.open}
        edit={addressModalProps.edit}
        onClose={() => setAddressModalProps({ open: false, edit: null })}
      />
    </Box>
  );
}

AddressSelector.propTypes = {
  onSelect: PropTypes.func,
  name: PropTypes.string,
};

AddressSelector.defaultProps = {
  onSelect: undefined,
  name: 'addresses',
};

class AddressItemDataHandler {
  constructor(address) {
    const addressContent = address.content;

    // process field data
    const addressLine2 = addressContent.addressLine2
      ? `\n${addressContent.addressLine2}`
      : '';
    let region = `\n${addressContent.country.label}`;
    if (addressContent.state)
      region = `${region}, ${addressContent.state.label}`;
    if (addressContent.city) region = `${region}, ${addressContent.city.label}`;
    const readablePhoneNumber = formatPhoneNumberIntl(
      addressContent.phoneNumber
    );

    this.line = [];
    this.line[0] = `${addressContent.firstName} ${addressContent.lastName}`;
    this.line[1] = `Phone No:${readablePhoneNumber}`;
    this.line[2] = `${addressContent.addressLine1}${addressLine2}${region}`;
  }
}

function AddressItem({ address, selected, readOnly, edit, remove }) {
  const addressData = new AddressItemDataHandler(address);
  const outlineColorPalette = selected ? 'secondary' : 'primary';
  return (
    <Stack
      sx={{
        bgcolor: (theme) =>
          selected ? alpha(theme.palette.secondary.light, 0.2) : 'white',
        height: '100%',
        width: '350px',
        borderRadius: (theme) => theme.shape.borderRadius,
        outline: '4px solid',
        outlineColor: (theme) => theme.palette[outlineColorPalette].light,
        p: 2,
        cursor: readOnly ? 'auto' : 'pointer',
      }}
    >
      <Typography variant="h6">{addressData.line[0]}</Typography>
      <Typography variant="subtitle2">{addressData.line[1]}</Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
        }}
        gutterBottom
      >
        {addressData.line[2]}
      </Typography>
      <Box sx={{ mt: 'auto' }}>
        <Button onClick={() => edit(address)}>Edit</Button>
        <Button onClick={() => remove(address)}>Delete</Button>
      </Box>
    </Stack>
  );
}

AddressItem.propTypes = {
  address: PropTypes.instanceOf(Address).isRequired,
  selected: PropTypes.bool,
  readOnly: PropTypes.bool,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

AddressItem.defaultProps = {
  selected: false,
  readOnly: false,
};

export default AddressSelector;
