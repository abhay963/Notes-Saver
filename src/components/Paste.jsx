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

  const pastes = useSelector((state) => state.paste.pastes);

  const [searchTerm, setSearchTerm] = useState("");

  const [expanded, setExpanded] = useState({});

  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (pasteId) => {
    dispatch(removeFromPastes(pasteId));
  };

  const truncateWords = (text, limit = 50) => {
    const words = text.trim().split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  // OPEN LINK FUNCTION
  const handleOpenLink = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = content.match(urlRegex);

    if (match && match[0]) {
      window.open(match[0], "_blank");
    } else {
      toast.error("❌ No valid link found!");
    }
  };

 return (
  <div
    className="
      max-w-5xl mx-auto px-4 py-10 font-sans
      bg-white dark:bg-slate-950
      min-h-screen
      transition-all duration-300
    "
  >
    {/* Heading */}
    <h1
      className="
        text-3xl md:text-4xl font-extrabold mb-8 tracking-tight
        text-black dark:text-white
        transition-all duration-300
      "
    >
      📝 Your Notes
    </h1>

    {/* Search Input */}
    <input
      className="
        w-full px-5 py-3 rounded-lg
        border border-gray-300 dark:border-slate-700
        shadow-sm

        bg-white dark:bg-slate-900

        focus:outline-none
        focus:ring-2 focus:ring-indigo-500

        text-sm
        text-gray-800 dark:text-gray-100

        placeholder-gray-400 dark:placeholder-gray-500

        transition-all duration-300
      "
      type="search"
      placeholder="🔍 Search your notes..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Notes Container */}
    <div className="mt-8 space-y-6">
      {filteredData.length > 0 ? (
        filteredData.map((paste) => (
          <div
            key={paste._id}
            className="
              bg-white dark:bg-slate-900
              shadow-sm hover:shadow-md
              border border-gray-200 dark:border-slate-700
              rounded-xl p-5
              transition-all duration-300
            "
          >
            {/* Title */}
            <h2
              className="
                text-xl md:text-2xl font-bold
                text-indigo-700 dark:text-indigo-400
                mb-1 leading-snug
              "
            >
              {paste.title}
            </h2>

            {/* Content */}
            <p
              className="
                text-sm
                text-gray-700 dark:text-gray-300
                whitespace-pre-wrap
                leading-relaxed
                mb-4
                border-l-4 border-indigo-200 dark:border-indigo-500
                pl-4 italic
                transition-all duration-300
              "
            >
              {expanded[paste._id]
                ? paste.content
                : truncateWords(paste.content, 50)}
            </p>

            {/* Show More / Less */}
            {paste.content.trim().split(" ").length > 50 && (
              <button
                onClick={() => toggleExpanded(paste._id)}
                className="
                  text-blue-600 dark:text-blue-400
                  text-xs underline mb-2
                "
              >
                {expanded[paste._id]
                  ? "Show Less"
                  : "Show More"}
              </button>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-medium">

              {/* Edit */}
              <Link to={`/?pasteId=${paste._id}`}>
                <button
                  className="
                    px-3 py-1 rounded-full
                    bg-blue-100 dark:bg-blue-900/40
                    text-blue-700 dark:text-blue-300
                    hover:bg-blue-200 dark:hover:bg-blue-800/50
                    transition cursor-pointer
                  "
                >
                  ✏️ Edit
                </button>
              </Link>

              {/* View */}
              <Link to={`/pastes/${paste._id}`}>
                <button
                  className="
                    px-3 py-1 rounded-full
                    bg-purple-100 dark:bg-purple-900/40
                    text-purple-700 dark:text-purple-300
                    hover:bg-purple-200 dark:hover:bg-purple-800/50
                    transition cursor-pointer
                  "
                >
                  👁️ View
                </button>
              </Link>

              {/* Delete */}
              <button
                onClick={() => handleDelete(paste._id)}
                className="
                  px-3 py-1 rounded-full
                  bg-red-100 dark:bg-red-900/40
                  text-red-600 dark:text-red-300
                  hover:bg-red-200 dark:hover:bg-red-800/50
                  transition cursor-pointer
                "
              >
                🗑️ Delete
              </button>

              {/* Copy */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paste.content);
                  toast.success("📋 Copied!");
                }}
                className="
                  px-3 py-1 rounded-full
                  bg-green-100 dark:bg-green-900/40
                  text-green-700 dark:text-green-300
                  hover:bg-green-200 dark:hover:bg-green-800/50
                  transition cursor-pointer
                "
              >
                📄 Copy
              </button>

              {/* Open In Browser */}
              <button
                onClick={() => handleOpenLink(paste.content)}
                className="
                  px-3 py-1 rounded-full
                  bg-yellow-100 dark:bg-yellow-900/40
                  text-yellow-700 dark:text-yellow-300
                  hover:bg-yellow-200 dark:hover:bg-yellow-800/50
                  transition cursor-pointer
                "
              >
                🌐 Open
              </button>
            </div>

            {/* Timestamp */}
            <div
              className="
                text-xs
                text-gray-400 dark:text-gray-500
                mt-3
              "
            >
              Created:{" "}
              {new Date(paste.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <div
          className="
            text-center
            text-gray-400 dark:text-gray-500
            mt-20 text-sm
          "
        >
          No matching pastes found.
        </div>
      )}
    </div>
  </div>
);
};

export default Paste;