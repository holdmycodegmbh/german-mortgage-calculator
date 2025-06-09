"use client"

import type React from "react"

interface MortgageInputProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  unit: string
  step?: string
  placeholder?: string
}

export function MortgageInput({ id, label, value, onChange, unit, step = "0.01", placeholder }: MortgageInputProps) {
  const inputStyles =
    "mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm text-slate-700"
  const labelStyles = "block text-sm font-medium text-slate-600"

  return (
    <div>
      <label htmlFor={id} className={labelStyles}>
        {label} ({unit})
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={onChange}
        className={inputStyles}
        placeholder={placeholder}
        min="0"
        step={step}
      />
    </div>
  )
}
