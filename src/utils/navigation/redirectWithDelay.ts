import { useEffect, useState } from "react";

export function redirectWithDelay(navigate, path, delay = 2500) {
  setTimeout(() => {
    navigate(path);
  }, delay);
}
export function delaySkeleton(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function useDelay(ms = 5000) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return done;
}
