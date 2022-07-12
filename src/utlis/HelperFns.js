export function customSortingFn({ a, b, field }) {
  const findingFn = (() => {
    switch (Object.getPrototypeOf(a).constructor.name) {
      case Object.name:
        return (obj) => findSmallestInObj(obj, field);
      case Array.name:
        return findSmallestInArray;
      default:
        return (val) => val;
    }
  })();

  const aFieldVal = findingFn(a);
  const bFieldVal = findingFn(b);

  return aFieldVal - bFieldVal;
}

export function getPropertyValue(obj1, dataToRetrieve) {
  return dataToRetrieve
    .split('.') // split string based on `.`
    .reduce((o, k) => {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj1); // set initial value as object
}

export function findSmallestInObj(obj, field) {
  let executionHandedOff = false;
  return field.split('.').reduce((o, k, i, allFields) => {
    if (!o || executionHandedOff) return o;
    if (Array.isArray(o[k])) {
      const remainingFields = allFields.slice(i + 1).join('.');
      executionHandedOff = true;
      return findSmallestInArray(o[k], remainingFields);
    }
    return o[k];
  }, obj);
}

export function findSmallestInArray(arr, field) {
  return arr.reduce((smallest, currItem) => {
    const findingFn = (() => {
      switch (Object.getPrototypeOf(currItem).constructor.name) {
        case Object.name:
          return (obj) => findSmallestInObj(obj, field);
        case Array.name:
          return findSmallestInArray;
        default:
          return (val) => val;
      }
    })();

    const smallestInCurr = findingFn(currItem);
    if (smallest === null) return smallestInCurr;
    if (smallestInCurr === null) return smallest;
    const newSmallest = smallestInCurr < smallest ? smallestInCurr : smallest;
    return newSmallest;
  }, null);
}
