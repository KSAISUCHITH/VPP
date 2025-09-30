import React from 'react'

// Minimal date picker wrapper that works with ReportGenerator date handling
export function Calendar({ className = '', mode = 'single', selected, onSelect }) {
  const dateStr = selected ? new Date(selected).toISOString().slice(0, 10) : ''
  return (
    <input
      type="date"
      className={`border rounded-md px-3 py-2 ${className}`}
      value={dateStr}
      onChange={(e) => onSelect?.(new Date(e.target.value))}
    />
  )
}


