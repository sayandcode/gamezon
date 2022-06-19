function sleep(time) {
  return new Promise((res, rej) => {
    setTimeout(res, time);
  });
}

module.exports = sleep;
