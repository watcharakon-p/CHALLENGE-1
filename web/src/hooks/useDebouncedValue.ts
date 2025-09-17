"use client"

import { useEffect, useState } from "react"

export function useDebouncedValue<T>(value: T, delay: number) {
   const [v,setV] = useState(value)

   useEffect(() => {
    const timeout = setTimeout(() => {
      setV(value)
    }, delay)
    return () => clearTimeout(timeout)
   }, [value,delay]);

   return v
}
