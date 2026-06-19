import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Paste from './components/Paste';
import ViewPaste from './components/ViewPaste';
import toast from 'react-hot-toast';
import { Toaster } from "react-hot-toast";
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Navbar />
        <Home />
      </div>
    ),
  },
  {
    path: '/pastes',
    element: (
      <div>
        <Navbar />
        <Paste />
      </div>
    ),
  },
  {
    path: '/pastes/:id',
    element: (
      <div>
        <Navbar />
        <ViewPaste />
      </div>
    ),
  },
]);

function App() {
  return (
    <div >
       <Toaster position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
