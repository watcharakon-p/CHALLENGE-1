"use client"

import { InputHTMLAttributes, useMemo } from "react"

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ className, ...props }: TextFieldProps) {
  const inputClass = useMemo(() => {
    return `border border-slate-300 rounded-md py-2 px-3 bg-white text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:border-slate-400 ${className ?? ""}`
  }, [className])

  return <input type="text" {...props} className={inputClass} />
}