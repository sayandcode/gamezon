import { City, Country, State } from 'country-state-city';
import { string as YupString } from 'yup';

// <benefactor> indicates whether or not the given field has dependants
// If it does have dependants, then an isoCode is mandatory, since
// that is what is used to derive the options
function getCscObjShape({ benefactor = true } = {}) {
  const label = YupString().required('Every Option Should have a label');
  let isoCode = YupString();
  if (benefactor)
    isoCode = isoCode.required(
      'This field needs an isoCode for its dependants'
    );

  return { label, isoCode };
}

function getCountryOptions() {
  const allCountries = Country.getAllCountries();
  const countryOptions = getOptionsFromCscObjList(allCountries);
  return countryOptions;
}

function getStateOptions(selectedCountry) {
  const allStates = State.getStatesOfCountry(selectedCountry?.isoCode);
  const stateOptions = getOptionsFromCscObjList(allStates);
  return stateOptions;
}

function getCityOptions(selectedCountry, selectedState) {
  const allCities = City.getCitiesOfState(
    selectedCountry?.isoCode,
    selectedState?.isoCode
  );
  const cityOptions = getOptionsFromCscObjList(allCities);
  return cityOptions;
}

function getOptionsFromCscObjList(cscObjList) {
  return cscObjList.map((cscObj) => ({
    label: cscObj.name,
    isoCode: cscObj.isoCode,
  }));
}

export { getCscObjShape, getCountryOptions, getStateOptions, getCityOptions };
