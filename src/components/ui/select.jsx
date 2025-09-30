import React, { createContext, useContext, useState } from 'react'

const SelectCtx = createContext(null)

export function Select({ value, defaultValue, onValueChange, children }) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const selected = value !== undefined ? value : internal
  const setValue = (v) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <SelectCtx.Provider value={{ value: selected, setValue }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectCtx.Provider>
  )
}

export function SelectTrigger({ className = '', children }) {
  return <div className={`border rounded-md px-3 py-2 ${className}`}>{children}</div>
}

export function SelectValue() {
  const ctx = useContext(SelectCtx)
  return <span>{ctx?.value || 'Select…'}</span>
}

export function SelectContent({ className = '', children }) {
  return <div className={`mt-2 border rounded-md bg-white shadow ${className}`}>{children}</div>
}

export function SelectItem({ value, children, className = '' }) {
  const ctx = useContext(SelectCtx)
  const selected = ctx?.value === value
  return (
    <div
      role="option"
      aria-selected={selected}
      className={`px-3 py-2 cursor-pointer hover:bg-slate-100 ${className}`}
      onClick={() => ctx?.setValue?.(value)}
    >
      {children}
    </div>
  )
}


