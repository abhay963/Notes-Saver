import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPastes } from "../redux/pasteSlice";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({});

  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (pasteId) => {
   
      dispatch(removeFromPastes(pasteId));
    
    
  };

  const truncateWords = (text, limit = 50) => {
    const words = text.trim().split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans bg-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-black">
        📝 Your Notes
      </h1>

      <input
        className="w-full px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 placeholder-gray-400"
        type="search"
        placeholder="🔍 Search your notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-8 space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((paste) => (
            <div
              key={paste._id}
              className="bg-white shadow-sm hover:shadow-md transition duration-200 border border-gray-200 rounded-xl p-5"
            >
              <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-1 leading-snug">
                {paste.title}
              </h2>

              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 border-l-4 pl-4 border-indigo-200 italic">
                {expanded[paste._id]
                  ? paste.content
                  : truncateWords(paste.content, 50)}
              </p>

              {paste.content.trim().split(" ").length > 50 && (
                <button
                  onClick={() => toggleExpanded(paste._id)}
                  className="text-blue-600 text-xs underline mb-2"
                >
                  {expanded[paste._id] ? "Show Less" : "Show More"}
                </button>
              )}

              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <Link to={`/?pasteId=${paste._id}`}>
                  <button className=" px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer">
                    ✏️ Edit
                  </button>
                </Link>

                <Link to={`/pastes/${paste._id}`}>
                  <button className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition cursor-pointer">
                    👁️ View
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(paste._id)}
                  className="px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
                >
                  🗑️ Delete
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paste.content);
                    toast.success("📋 Copied!");
                  }}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition cursor-pointer"
                >
                  📄 Copy
                </button>

               
              </div>

              <div className="text-xs text-gray-400 mt-3">
                Created: {new Date(paste.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-20 text-sm">
            No matching pastes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Paste;
