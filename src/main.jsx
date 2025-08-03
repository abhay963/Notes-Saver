import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext';
createRoot(document.getElementById('root')).render(

  <StrictMode>
     <ThemeProvider>
    <Provider store={store}>
    <App />
    <Toaster/>
    </Provider>
</ThemeProvider>
  </StrictMode>,
)
