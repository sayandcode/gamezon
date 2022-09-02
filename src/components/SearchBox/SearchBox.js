import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchOptions from './Helpers/fetchOptions';
import RenderInputForSearchBox from './Subcomponents/RenderInputForSearchBox';
import SearchOption from './Subcomponents/SearchOption/SearchOption';

function SearchBox() {
  /* COMPONENT STATE */
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  /* FUNCTION DEFINITIONS */
  function showNoOptions() {
    setOptions([]);
    setOpen(false);
  }
  function showLoadingState() {
    setOptions([]);
    setLoading(true);
  }
  async function showOptionsFor(queryString) {
    const newOptions = await fetchOptions(queryString);
    setOptions(newOptions);
    setLoading(false);
  }

  /* EVENT HANDLERS */
  const handleOpen = (event) => {
    const textInBox = event.target.value;
    if (!textInBox) return;
    setOpen(true);
  };
  const handleInputChange = async (event, queryString, reasonForChange) => {
    if (!queryString || reasonForChange !== 'input') {
      showNoOptions();
      return;
    }
    showLoadingState();
    showOptionsFor(queryString);
  };

  const navigate = useNavigate();
  const handleSelectOption = (event, option) => {
    navigate(`/product/${option.title}`);
  };
  return (
    <Autocomplete
      /* design */
      size="small"
      sx={{ width: '50%' }}
      renderInput={(params) => (
        <RenderInputForSearchBox
          ref={params.InputProps.ref}
          inputProps={params.inputProps}
        />
      )}
      renderOption={(props, option, state) => (
        <SearchOption
          key={option.key}
          props={props}
          option={option}
          state={state}
        />
      )}
      noOptionsText="Couldn't find any matching titles"
      ListboxProps={{ sx: { maxHeight: '400px' } }}
      /* logic */
      open={open}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      filterOptions={(x) => x} // disables default filtering, as we handle it in  algolia
      onInputChange={handleInputChange}
      value={null} // prevents actual selecting. onSelect, the page reroutes
      blurOnSelect
      onChange={handleSelectOption}
    />
  );
}

export default SearchBox;
