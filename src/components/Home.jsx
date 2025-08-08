// ------------------------ IMPORTS ----------------------------

// Importing core React functionality and hooks
import React, { useEffect, useState } from 'react'; 
// useEffect is used to perform side effects (like loading note data when editing)
// useState is used for managing local component state (title & content)

// Importing Redux hooks
import { useDispatch, useSelector } from 'react-redux'; 
// useDispatch is used to dispatch actions to Redux (e.g., adding or updating a note)
// useSelector is used to access global state from Redux store (e.g., all notes)

// Importing React Router functionality
import { useSearchParams } from 'react-router-dom'; 
// useSearchParams lets us access query params from the URL (e.g., ?pasteId=xyz)

// Importing custom Redux actions for adding and updating notes
import { addToPaste, updateToPastes } from '../redux/pasteSlice'; 

// Importing toast for showing success/error notifications
import toast from 'react-hot-toast';


// ------------------------ COMPONENT ----------------------------

// Main functional component for the homepage
const Home = () => {
  // ---------------- LOCAL STATE ----------------
  
  // Local state for storing the note title
  const [title, setTitle] = useState('');
  
  // Local state for storing the note content/body
  const [value, setValue] = useState('');
  
  // ---------------- URL PARAMS ----------------
  
  // Using useSearchParams to access URL query params
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId"); 
  // If pasteId is present, the user is editing an existing note

  // ---------------- REDUX HOOKS ----------------
  
  const dispatch = useDispatch(); // Used to trigger Redux actions like add/update
  const allPastes = useSelector((state) => state.paste.pastes); 
  // Fetch all notes from the Redux global state

  // ---------------- SIDE EFFECT ----------------
  
  useEffect(() => {
    // If editing mode is ON and notes exist in Redux store
    if (pasteId && allPastes.length > 0) {
      // Try to find the matching note by its ID
      const paste = allPastes.find((p) => p._id === pasteId);
      
      if (paste) {
        // If found, pre-fill the form with existing title and content
        setTitle(paste.title);
        setValue(paste.content);
      } else {
        // If not found (invalid pasteId), clear the form
        setTitle('');
        setValue('');
      }
    }

    // If pasteId is removed from the URL, also clear the form (clean state)
    if (!pasteId) {
      setTitle('');
      setValue('');
    }
  }, [pasteId, allPastes]); 
  // Triggers every time pasteId or the list of notes change

  // ---------------- HANDLE CREATE / UPDATE ----------------

  const createPaste = () => {
    // Validation: ensure title and content are not empty
    if (title.trim() === '' || value.trim() === '') {
      toast.error("Please fill out both the title and content!");
      return;
    }

    // Avoid duplicate notes: Check if another note with same title exists
    const existingPaste = allPastes.find(
      (p) => p._id === pasteId || (p.title === title && !pasteId)
    );

    // Show error if trying to create duplicate (when not editing)
    if (!pasteId && existingPaste) {
      toast.error("Paste already exists!");
      return;
    }

    // Create the note object with metadata
    const paste = {
      title,
      content: value,
      _id: pasteId || Date.now().toString(36), // Use existing ID or generate a unique one
      createdAt: new Date().toString(), // Add creation date
    };

    // Dispatch appropriate Redux action
    if (pasteId) {
      dispatch(updateToPastes(paste)); // Update existing note
      toast.success("Note updated successfully!");
    } else {
      dispatch(addToPaste(paste)); // Add new note
      toast.success("Note created successfully!");
    }

    // After submission, clear form fields and remove pasteId from URL
    setTitle('');
    setValue('');
    setSearchParams({}); // Clears query params from URL
  };

  // ---------------- COPY TO CLIPBOARD ----------------

  const copyToClipboard = () => {
    // If content exists, copy it to the clipboard
    if (value.trim() !== '') {
      navigator.clipboard.writeText(value); // Native browser API
      toast.success("Content copied to clipboard!");
    }
  };

  // ---------------- RETURN JSX ----------------

  return (
    // Full-screen main container with light gray background and centered content
    <div className="w-full h-screen bg-neutral-100 flex items-center justify-center px-4">

      {/* Inner container with max width and vertical spacing */}
      <div className="w-full max-w-4xl h-full flex flex-col py-6 space-y-4">

        {/* Top section: Title input and Create/Update button */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

          {/* Title input field */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title on typing
            placeholder="Title"
            className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-md 
                       text-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 
                       shadow-sm text-gray-900 placeholder-gray-400"
          />

          {/* Submit button - Label changes based on whether editing or creating */}
          <button
            onClick={createPaste}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black 
                       font-semibold text-base rounded-md shadow-sm transition cursor-pointer"
          >
            {pasteId ? "Update Note" : "Create Note"}
          </button>
        </div>

        {/* Main notepad container */}
        <div className="flex-1 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden flex flex-col">

          {/* Notepad header: traffic light dots + copy button */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b">

            {/* Fake Mac-style colored dots for UI aesthetics */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Copy to clipboard button */}
            <button
              onClick={copyToClipboard}
              className="text-gray-600 hover:text-black text-sm cursor-pointer"
              title="Copy to Clipboard"
            >
              📋 Copy
            </button>
          </div>

          {/* Text area for writing the note content */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)} // Update content on typing
            placeholder="Start typing your note..."
            className="w-full flex-1 px-5 py-4 resize-none outline-none 
                       bg-white text-gray-800 text-base font-sans leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

// Exporting the Home component so it can be used in App.js or routed
export default Home;
