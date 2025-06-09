"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ValidatedMortgageInputProps {
  id: string
  label: string
  value: string | number
  onChange: (value: number) => void
  unit: string
  step?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function ValidatedMortgageInput({ 
  id, 
  label, 
  value, 
  onChange, 
  unit, 
  step = "0.01", 
  placeholder,
  error,
  disabled = false
}: ValidatedMortgageInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    onChange(numValue);
  };



  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-slate-700"
      >
        {label} ({unit})
      </Label>
      <Input
        type="number"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min="0"
        step={step}
        disabled={disabled}
        className={`
          ${error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
            : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
          }
        `}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
} 