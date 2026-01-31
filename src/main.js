import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () =>
  React.createElement(RouterProvider, { router })

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(React.createElement(App))