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

  // 🔄 When `pasteId` or `allPastes` changes, update the local state to pre-fill or reset the input fields
  useEffect(() => {
    if (pasteId && allPastes.length > 0) {
      const paste = allPastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      } else {
        setTitle('');
        setValue('');
      }
    }

    // ✅ Reset fields if pasteId is removed (after update)
    if (!pasteId) {
      setTitle('');
      setValue('');
    }
  }, [pasteId, allPastes]);

  // ✍️ Function to handle paste creation or update
  const createPaste = () => {
    if (title.trim() === '' || value.trim() === '') {
      toast.error("Please fill out both the title and content!");
      return;
    }

    const existingPaste = allPastes.find(
      (p) => p._id === pasteId || (p.title === title && !pasteId)
    );

    if (!pasteId && existingPaste) {
      toast.error("Paste already exists!");
      return;
    }

    const paste = {
      title,
      content: value,
      _id: pasteId || Date.now().toString(36),
      createdAt: new Date().toString(),
    };

    if (pasteId) {
      dispatch(updateToPastes(paste));
      toast.success("Note updated successfully!");
    } else {
      dispatch(addToPaste(paste));
      toast.success("Note created successfully!");
    }

    // ✅ Clear form inputs
    setTitle('');
    setValue('');

    // ✅ Clear URL search param (to exit update mode)
    setSearchParams({});
  };

  // 📋 Function to copy content to clipboard
  const copyToClipboard = () => {
    if (value.trim() !== '') {
      navigator.clipboard.writeText(value);
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
          />

          {/* Button to create or update paste */}
          <button
            onClick={createPaste}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base 
                       rounded-md shadow-sm transition cursor-pointer"
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
              className="text-gray-600 hover:text-black text-sm cursor-pointer"
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
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
