import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../Layout.jsx'
import './index.css'
import Dashboard from '../Pages/Dashboard'
import Analytics from '../Pages/Analytics'
import DigitalTwin from '../Pages/DigitalTwin'
import Reports from '../Pages/Reports'
import Settings from '../Pages/Settings'
import Simulator from '../Pages/Simulator'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  { path: '/dashboard', element: <Layout><Dashboard /></Layout> },
  { path: '/analytics', element: <Layout><Analytics /></Layout> },
  { path: '/digitaltwin', element: <Layout><DigitalTwin /></Layout> },
  { path: '/reports', element: <Layout><Reports /></Layout> },
  { path: '/settings', element: <Layout><Settings /></Layout> },
  { path: '/simulator', element: <Layout><Simulator /></Layout> },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


