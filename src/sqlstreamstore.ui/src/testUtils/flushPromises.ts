const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;

function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve, 0);
  });
}

export default flushPromises;
