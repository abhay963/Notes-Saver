// Importing necessary React hooks and Redux utilities
import React, { useEffect, useState } from 'react'; // React core and hooks
import { useDispatch, useSelector } from 'react-redux'; // For dispatching and accessing Redux store
import { useSearchParams } from 'react-router-dom'; // To get query params from the URL
import { addToPaste, updateToPastes } from '../redux/pasteSlice'; // Redux actions
import toast from 'react-hot-toast'; // For showing notifications

// Main component function
const Home = () => {
  // Local state to manage the title and content of the note
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  // React-router hook to get and set URL parameters (used for editing a paste)
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId"); // get the `pasteId` from URL if available

  const dispatch = useDispatch(); // Allows you to dispatch actions to Redux
  const allPastes = useSelector((state) => state.paste.pastes); // Access pastes array from Redux store

  // When `pasteId` or `allPastes` changes, update the local state to pre-fill the input fields for editing
  useEffect(() => {
    if (pasteId && allPastes.length > 0) {
      const paste = allPastes.find((p) => p._id === pasteId); // Find the paste by id
      if (paste) {
        setTitle(paste.title); // Set the title to existing value
        setValue(paste.content); // Set the content to existing value
      } else {
        setTitle('');
        setValue('');
      }
    }
  }, [pasteId, allPastes]); // Dependencies for useEffect

  // Function to handle paste creation or update
  const createPaste = () => {
    // Validate that both fields are filled
    if (title.trim() === '' || value.trim() === '') {
      toast.error("Please fill out both the title and content!");
      return;
    }

    // Check for duplicate paste only when creating new
    const existingPaste = allPastes.find(
      (p) => p._id === pasteId || (p.title === title && !pasteId)
    );

    if (!pasteId && existingPaste) {
      toast.error("Paste already exists!");
      return;
    }

    // Build the paste object
    const paste = {
      title,
      content: value,
      _id: pasteId || Date.now().toString(36), // unique ID using timestamp if new
      createdAt: new Date().toString(), // Save creation date
    };

    if (pasteId) {
      dispatch(updateToPastes(paste)); // Update existing paste
      toast.success("Paste updated!");
    } else {
      dispatch(addToPaste(paste)); // Add new paste
      toast.success("Paste created!");
    }

    // Clear input and reset URL params
    setTitle('');
    setValue('');
    setSearchParams({});
  };

  // Function to copy content to clipboard
  const copyToClipboard = () => {
    if (value.trim() !== '') {
      navigator.clipboard.writeText(value); // Use browser clipboard API
      toast.success("Content copied to clipboard!");
    }
  };

  return (
    // Full screen container with light background, centered content
    <div className="w-full h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl h-full flex flex-col py-6 space-y-4">
        
        {/* Input field and submit button section */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          {/* Input for Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-md text-lg font-medium 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm 
                       text-gray-900 placeholder-gray-400"
            // Styling explanation:
            // flex-1: take max width
            // border: light gray border
            // focus:ring-yellow-500: yellow glow when selected
          />

          {/* Button to create or update paste */}
          <button
            onClick={createPaste}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base 
                       rounded-md shadow-sm transition"
            // Styling explanation:
            // bg-yellow-400: background color
            // hover:bg-yellow-500: slightly darker on hover
            // transition: smooth hover effect
          >
            {pasteId ? "Update Note" : "Create Note"}
          </button>
        </div>

        {/* Notepad section */}
        <div className="flex-1 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden flex flex-col">
          {/* Header with 3 dots and copy button */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b">
            <div className="flex space-x-2">
              {/* Mac-style control dots */}
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className="text-gray-600 hover:text-black text-sm"
              title="Copy to Clipboard"
            >
              📋 Copy
            </button>
          </div>

          {/* The textarea for writing note content */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Start typing your note..."
            className="w-full flex-1 px-5 py-4 resize-none outline-none 
                       bg-white text-gray-800 text-base font-sans leading-relaxed"
            // Styling explanation:
            // resize-none: disable resizing
            // flex-1: take up all vertical space
            // leading-relaxed: better line spacing
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
