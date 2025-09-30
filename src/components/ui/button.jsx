import React from 'react'

export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}


