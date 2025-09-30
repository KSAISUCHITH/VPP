import React from 'react'

// Lightweight slider that is API-compatible with shadcn/radix Slider for single-thumb use
// Accepts `value` as a number or [number] and supports both `onChange` and `onValueChange` callbacks
export function Slider({
  value,
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}) {
  const numericValue = Array.isArray(value) ? value[0] : (typeof value === 'number' ? value : 0)

  const handleChange = (e) => {
    const v = Number(e.target.value)
    onChange?.(v)
    onValueChange?.([v])
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={numericValue}
      onChange={handleChange}
      className={`w-full h-2 rounded-lg bg-slate-200 accent-blue-600 ${className}`}
    />
  )
}


