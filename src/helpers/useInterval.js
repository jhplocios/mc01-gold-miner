import { useRef, useEffect } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  // remember the last callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    } 
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      }
    }
  }, [callback, delay]);
}