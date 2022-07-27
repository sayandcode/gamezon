function wrapPromise(promise) {
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
  };
}

// eslint-disable-next-line import/prefer-default-export
export { wrapPromise };
