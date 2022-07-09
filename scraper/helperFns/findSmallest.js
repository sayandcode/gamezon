function findSmallestInObj(obj, field) {
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

function findSmallestInArray(arr, field) {
  return arr.reduce((smallest, currItem) => {
    const findingFn = (() => {
      switch (Object.getPrototypeOf(currItem).constructor.name) {
        case 'Object':
          return (obj) => findSmallestInObj(obj, field);
        case 'Array':
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

exports.findSmallestInObj = findSmallestInObj;
exports.findSmallestInArray = findSmallestInArray;
