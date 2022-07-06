// eslint-disable-next-line no-extend-native
Promise.allSettledFiltered = async (arr) => {
  const promises = await Promise.allSettled(arr);
  return promises
    .filter((res) => res.status === 'fulfilled')
    .map((res) => res.value);
};
