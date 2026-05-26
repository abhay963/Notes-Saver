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
  // Full-screen main container
  <div className="w-full h-screen bg-neutral-100 dark:bg-slate-950 transition-all duration-300 flex items-center justify-center px-4">

    {/* Inner container */}
    <div className="w-full max-w-4xl h-full flex flex-col py-6 space-y-4">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="
            flex-1 px-4 py-3
            border border-gray-300 dark:border-slate-700
            bg-white dark:bg-slate-900
            rounded-md
            text-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-yellow-500
            shadow-sm
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-300
          "
        />

        {/* Create / Update Button */}
        <button
          onClick={createPaste}
          className="
            px-6 py-3
            bg-yellow-400 hover:bg-yellow-500
            text-black
            font-semibold text-base
            rounded-md shadow-sm
            transition-all duration-300
            cursor-pointer
          "
        >
          {pasteId ? "Update Note" : "Create Note"}
        </button>
      </div>

      {/* Main Notepad */}
      <div
        className="
          flex-1
          bg-white dark:bg-slate-900
          border border-gray-300 dark:border-slate-700
          rounded-md shadow-sm
          overflow-hidden
          flex flex-col
          transition-all duration-300
        "
      >

        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-4 py-2
            bg-neutral-50 dark:bg-slate-800
            border-b border-gray-300 dark:border-slate-700
            transition-all duration-300
          "
        >

          {/* Mac Dots */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="
              text-gray-600 dark:text-gray-300
              hover:text-black dark:hover:text-white
              text-sm cursor-pointer
              transition-all duration-300
            "
            title="Copy to Clipboard"
          >
            📋 Copy
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start typing your note..."
          className="
            w-full flex-1
            px-5 py-4
            resize-none outline-none

            bg-white dark:bg-slate-900
            text-gray-800 dark:text-gray-100

            text-base font-sans leading-relaxed

            placeholder-gray-400 dark:placeholder-gray-500

            transition-all duration-300
          "
        />
      </div>
    </div>
  </div>
);
};

// Exporting the Home component so it can be used in App.js or routed
export default Home;
