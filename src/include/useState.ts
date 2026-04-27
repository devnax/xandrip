import { useCallback, useRef, useState } from "react";


const useStableState = <T,>(initial: T) => {
   const [, force] = useState(0);
   const ref = useRef<T>(initial);

   const get = useCallback(() => ref.current, []);
   const set = useCallback((next: T | ((prev: T) => T)) => {
      ref.current =
         typeof next === "function"
            ? (next as (v: T) => T)(ref.current)
            : next;

      force(v => v + 1);
   }, []);

   return [get, set, ref] as const;
};

export default useStableState;