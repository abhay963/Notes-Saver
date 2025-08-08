// Importing React and its hook for managing component-level state
import React, { useState } from "react";

// Importing hooks from Redux:
// - useDispatch: to send actions to Redux store (e.g., delete a note)
// - useSelector: to read data (like notes list) from the Redux store
import { useDispatch, useSelector } from "react-redux";

// Importing a Redux action to remove a note from the global state
import { removeFromPastes } from "../redux/pasteSlice";

// Importing a library to display temporary toast notifications (e.g., "Copied!")
import toast from "react-hot-toast";

// Importing Link from React Router to navigate between routes (Edit and View)
import { Link } from 'react-router-dom';

// Functional React component to display and manage all saved notes
const Paste = () => {
  // Using Redux's useSelector to access the list of notes stored in global state
  const pastes = useSelector((state) => state.paste.pastes);

  // Local state to store user input from the search bar
  const [searchTerm, setSearchTerm] = useState("");

  // Local state to track which notes are "expanded" to show full content
  // We use an object: { [noteId]: true/false }
  const [expanded, setExpanded] = useState({});

  // useDispatch gives us the dispatch function to trigger Redux actions
  const dispatch = useDispatch();

  // Filtering notes based on the search term
  // We compare lowercased title and searchTerm to make it case-insensitive
  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to toggle "Show More" or "Show Less" for a specific note by its ID
  const toggleExpanded = (id) => {
    setExpanded((prev) => ({
      ...prev,          // Keep the previous expanded states
      [id]: !prev[id],  // Flip the current state (true -> false or false -> true)
    }));
  };

  // Function to handle deletion of a note
  // Calls Redux action to remove note by its ID
  const handleDelete = (pasteId) => {
    dispatch(removeFromPastes(pasteId)); // Triggers delete from global store
  };

  // Utility function to truncate note content to a word limit (default: 50)
  const truncateWords = (text, limit = 50) => {
    const words = text.trim().split(" "); // Break text into words
    if (words.length <= limit) return text; // If already short, return as-is
    return words.slice(0, limit).join(" ") + "..."; // Truncate and add ellipsis
  };

  // JSX return block starts here – the full visual layout of the component
  return (
    // Outer container for the notes page – centers content and sets max width
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans bg-white">
      
      {/* Page Title / Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-black">
        📝 Your Notes
      </h1>

      {/* Search Input Field – lets user search notes by title */}
      <input
        className="w-full px-5 py-3 rounded-lg border border-gray-300 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   text-sm text-gray-800 placeholder-gray-400"
        type="search"
        placeholder="🔍 Search your notes..."
        value={searchTerm} // Controlled input: linked to local state
        onChange={(e) => setSearchTerm(e.target.value)} // Update state on type
      />

      {/* Container for list of all filtered notes */}
      <div className="mt-8 space-y-6">
        {/* If filtered notes exist, map through and display each one */}
        {filteredData.length > 0 ? (
          filteredData.map((paste) => (
            <div
              key={paste._id} // Always provide a unique key when mapping lists
              className="bg-white shadow-sm hover:shadow-md transition duration-200 
                         border border-gray-200 rounded-xl p-5"
            >
              {/* Note Title */}
              <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-1 leading-snug">
                {paste.title}
              </h2>

              {/* Note Content (truncated or full based on expansion state) */}
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed 
                            mb-4 border-l-4 pl-4 border-indigo-200 italic">
                {
                  expanded[paste._id] 
                    ? paste.content              // Show full content if expanded
                    : truncateWords(paste.content, 50) // Otherwise show preview
                }
              </p>

              {/* Show More / Show Less Button (only if content has > 50 words) */}
              {paste.content.trim().split(" ").length > 50 && (
                <button
                  onClick={() => toggleExpanded(paste._id)} // Toggle content view
                  className="text-blue-600 text-xs underline mb-2"
                >
                  {expanded[paste._id] ? "Show Less" : "Show More"}
                </button>
              )}

              {/* Action buttons: Edit | View | Delete | Copy */}
              <div className="flex flex-wrap gap-2 text-xs font-medium">

                {/* Edit Button: navigates to Home with pasteId query param */}
                <Link to={`/?pasteId=${paste._id}`}>
                  <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 
                                     hover:bg-blue-200 transition cursor-pointer">
                    ✏️ Edit
                  </button>
                </Link>

                {/* View Button: opens full note view on a separate page */}
                <Link to={`/pastes/${paste._id}`}>
                  <button className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 
                                     hover:bg-purple-200 transition cursor-pointer">
                    👁️ View
                  </button>
                </Link>

                {/* Delete Button: removes the note from Redux store */}
                <button
                  onClick={() => handleDelete(paste._id)} // Delete logic
                  className="px-3 py-1 rounded-full bg-red-100 text-red-600 
                             hover:bg-red-200 transition cursor-pointer"
                >
                  🗑️ Delete
                </button>

                {/* Copy Button: copies note content to clipboard */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paste.content); // Copy text
                    toast.success("📋 Copied!"); // Show toast feedback
                  }}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 
                             hover:bg-green-200 transition cursor-pointer"
                >
                  📄 Copy
                </button>
              </div>

              {/* Timestamp showing note creation date and time */}
              <div className="text-xs text-gray-400 mt-3">
                Created: {new Date(paste.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          // If no results match the search term, show this fallback message
          <div className="text-center text-gray-400 mt-20 text-sm">
            No matching pastes found.
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component so it can be used in the app or routed
export default Paste;
