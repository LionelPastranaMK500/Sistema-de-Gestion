export function redirectWithDelay(navigate, path, delay = 2500) {
    setTimeout(() => {
      navigate(path);
    }, delay);
  }