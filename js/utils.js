export function debounce(fun, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fun(...args), ms);
  };
}
