import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";

export function redirectWithDelay(
  navigate: NavigateFunction,
  path: string,
  delay = 2500
) {
  setTimeout(() => {
    navigate(path);
  }, delay);
}

export function delaySkeleton(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function useDelay(ms = 5000) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return done;
}
