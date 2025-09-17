"use client"

import { InputHTMLAttributes, useMemo } from "react"

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ className, ...props }: TextFieldProps) {
  const inputClass = useMemo(() => {
    return `border border-gray-300 rounded-md py-2 px-3 ${className}`
  }, [className])

  return <input type="text" {...props} className={inputClass} />
}
  