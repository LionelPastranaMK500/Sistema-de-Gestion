export function redirectWithDelay(navigate, path, delay = 2500) {
  setTimeout(() => {
    navigate(path);
  }, delay);
}
export function delaySkeleton(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}