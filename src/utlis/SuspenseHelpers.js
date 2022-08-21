import { useEffect, useState } from 'react';

function promiseToResource(promise) {
  let status = 'pending';
  let result;
  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'rejected';
      result = e;
    }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;
      else if (status === 'rejected') throw result;
      else return result;
    },
    get promise() {
      return suspender;
    },
  };
}

function useResource(dataFetchFn, dependencies) {
  const [stateVar, setStateVar] = useState(
    promiseToResource(new Promise(() => {}))
  );

  useEffect(updaterFn, dependencies);
  /* The dataFetchFn function can be anything, and can return anything. So for each
  use of the useResource hook, we have the freedom to implement whatever logic we want;
  be it fetching from a local cache, or remote database. This hook is oblivious and indifferent */
  function updaterFn() {
    const newResource = promiseToResource(dataFetchFn());
    setStateVar(newResource);
  }
  /* A good pattern to have is to have the data of the resource be a class instance.
  The class itself should be defined in conjunction with the consuming component, and can be instantiated
  using an async createFor method. Further, this class will have all the required methods and keys 
  that are required for that specific component's use case. This separates concerns, and lets the React
  component focus on only the rendering logic. The dataFetchFn should then call this createFor method
  inside it, which returns the instance */
  return stateVar;
}

export { promiseToResource, useResource };
