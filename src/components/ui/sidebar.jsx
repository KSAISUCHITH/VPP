import React, { createContext, useContext } from 'react'

const SidebarCtx = createContext({})

export function SidebarProvider({ children }) {
  return <SidebarCtx.Provider value={{}}>{children}</SidebarCtx.Provider>
}

export function Sidebar({ className = '', children }) {
  return <aside className={`w-64 hidden md:block ${className}`}>{children}</aside>
}

export function SidebarHeader({ className = '', children }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarContent({ className = '', children }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarGroup({ children }) { return <div>{children}</div> }
export function SidebarGroupLabel({ className = '', children }) { return <div className={className}>{children}</div> }
export function SidebarGroupContent({ children }) { return <div>{children}</div> }
export function SidebarMenu({ className = '', children }) { return <div className={className}>{children}</div> }
export function SidebarMenuItem({ children }) { return <div>{children}</div> }
export function SidebarMenuButton({ asChild, className = '', children }) {
  const content = <div className={`w-full ${className}`}>{children}</div>
  return asChild ? content : <button className={`w-full text-left ${className}`}>{children}</button>
}
export function SidebarTrigger({ className = '' }) {
  return <button className={`md:hidden ${className}`}>Menu</button>
}


