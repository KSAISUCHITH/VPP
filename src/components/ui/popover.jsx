import React, { useState } from 'react'

export function Popover({ children }) {
  return <div className="relative inline-block">{children}</div>
}

export function PopoverTrigger({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function PopoverContent({ children, className = '', align = 'start' }) {
  return (
    <div
      className={`absolute z-50 mt-2 border rounded-md bg-white shadow ${className}`}
      style={{ top: '100%', left: align === 'end' ? 'auto' : 0, right: align === 'end' ? 0 : 'auto', minWidth: 260 }}
    >
      {children}
    </div>
  )
}


