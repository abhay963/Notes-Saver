import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewPaste = () => {
  const { id } = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);
  const paste = allPastes.find((p) => p._id === id);

  if (!paste) {
    return <div className="p-10 text-red-500 text-center">Note not found 😞</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-5">
        <input
          className="p-3 rounded-md bg-gray-100 text-lg font-semibold text-gray-800 cursor-not-allowed"
          type="text"
          value={paste.title}
          disabled
        />

        <textarea
          className="p-4 rounded-md bg-gray-100 text-gray-800 text-base leading-relaxed min-h-[400px]"
          value={paste.content}
          disabled
          rows={20}
        />
      </div>
    </div>
  );
};

export default ViewPaste;
