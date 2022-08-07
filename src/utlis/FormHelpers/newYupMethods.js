import { addMethod, object, string } from 'yup';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { isOptionEqualToValue as isOptionEqualToSelectedOption } from '../../components/MuiAutocomplete';

/* Yup's schema validation for Autocomplete */
addMethod(
  object,
  'isFromOptionsProvidedBy',
  function isFromOptionsProvidedBy(
    optionProvidingFields,
    optionProvidingFn,
    {
      // eslint-disable-next-line no-template-curly-in-string
      errorMessage = 'That is not a valid ${path}',

      // <required> option is slightly different in autocomplete. There is no point of a required, if there are no options.
      // So this appends the .nullable() to the test, and handles this case manually inside the test fn.
      // The internal required check only works if there are options to be added.
      required,
    } = {}
  ) {
    return object()
      .test({
        name: 'isValidOption',
        test(selectedOption) {
          const { path, parent, createError } = this;
          const dependencies = optionProvidingFields.map(
            (field) => parent[field]
          );
          const options = optionProvidingFn(...dependencies);

          /* CALCULATE DATA TO BE USED */
          const thereAreNoOptions = options.length === 0;
          // <required> is polymorphic. It can either be true, or carry the string to show when required, which itself
          // indicates that required is true. For the first case, we specify a default message.
          const requiredMessage =
            // eslint-disable-next-line no-template-curly-in-string
            required === true ? '${path} cannot be empty' : required;

          /* HANDLE CASES */
          // Case 1: No options are possible, and we have no selectedOption
          if (thereAreNoOptions && !selectedOption) return true;
          // Case 2: Options are possible, and we have no selected option, and the field is required
          if (!selectedOption && requiredMessage)
            return createError({ path, message: requiredMessage });
          // ALL OTHER CASES: i.e. when options are provided, and an option(dk if selected from possible ones) is selected
          // Here, <required> check is immaterial, as an option is selected.
          const optionsHasSelectedOption = options.find((option) =>
            isOptionEqualToSelectedOption(option, selectedOption)
          );
          return (
            optionsHasSelectedOption ||
            createError({ path, message: errorMessage })
          );
        },
      })
      .nullable();
  }
);

/* Yup's schema validation for Phone Number */
addMethod(
  string,
  'isPossiblePhoneNumber',
  function validatePhoneNumber(errorMessage) {
    return this.test('is-a-phone-number', function testForPhoneNumber(value) {
      // For empty values, we allow the validation to happen externally, via .nullable() and .required()
      if (!value) return true;

      const { path, createError } = this;

      return (
        isPossiblePhoneNumber(value) ||
        createError({ path, message: errorMessage })
      );
    });
  }
);
