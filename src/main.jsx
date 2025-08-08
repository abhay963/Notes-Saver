// Import React's StrictMode component for highlighting potential problems in the application
// StrictMode performs additional checks and warnings for its descendants
import { StrictMode } from 'react'

// Import createRoot from ReactDOM client API for creating a root to render React components
// createRoot is the new concurrent renderer for React 18+
import { createRoot } from 'react-dom/client'

// Import the global CSS styles for the entire application
// These styles will be applied across all components
import './index.css'

// Import the main App component that serves as the root component of the application
import App from './App.jsx'

// Import the Redux store configuration
// This is the centralized state management store for the entire application
import { store } from './store.js'

// Import the Provider component from react-redux
// Provider makes the Redux store available to all components in the component tree
import { Provider } from 'react-redux'

// Import the Toaster component from react-hot-toast
// Toaster is responsible for displaying toast notifications across the application
import { Toaster } from 'react-hot-toast'

// Get the root DOM element where the React application will be mounted
// document.getElementById('root') finds the div with id="root" in index.html
const rootElement = document.getElementById('root')

// Create a root for concurrent rendering using React 18's createRoot API
// This enables concurrent features like automatic batching and Suspense
const root = createRoot(rootElement)

// Render the React application to the DOM
// The render method takes a React element and mounts it to the DOM
root.render(
  // Wrap the entire app in StrictMode to enable additional development checks
  <StrictMode>
    {/* Provider wraps the app to make Redux store available to all components */}
    <Provider store={store}>
      {/* The main App component that contains the entire application */}
      <App />
      {/* Toaster component for displaying toast notifications globally */}
      <Toaster/>
    </Provider>
  </StrictMode>,
)
