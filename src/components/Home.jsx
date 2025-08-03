import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToPaste, updateToPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const Home = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

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
  }, [pasteId, allPastes]);

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
      toast.success("Paste updated!");
    } else {
      dispatch(addToPaste(paste));
      toast.success("Paste created!");
    }

    setTitle('');
    setValue('');
    setSearchParams({});
  };

  const copyToClipboard = () => {
    if (value.trim() !== '') {
      navigator.clipboard.writeText(value);
      toast.success("Content copied to clipboard!");
    }
  };

  return (
    <div className="w-screen h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl h-full flex flex-col py-6 space-y-4">
        
        {/* Title + Button */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
             className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-md text-lg font-medium 
             focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm 
             text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={createPaste}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base rounded-md shadow-sm transition"
          >
            {pasteId ? "Update Note" : "Create Note"}
          </button>
        </div>

        {/* Notepad */}
        <div className="flex-1 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden flex flex-col">

          {/* Top bar with 3 Mac-style dots */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-gray-600 hover:text-black text-sm"
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
            className="w-full flex-1 px-5 py-4 resize-none outline-none bg-white text-gray-800 text-base font-sans leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
