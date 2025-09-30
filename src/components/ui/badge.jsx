import React from 'react'

export function Badge({ className = '', children, ...props }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${className}`} {...props}>
      {children}
    </span>
  )
}


