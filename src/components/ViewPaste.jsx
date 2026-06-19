import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewPaste = () => {
  const { id } = useParams();

  const allPastes = useSelector((state) => state.paste.pastes);

  const paste = allPastes.find((p) => p._id === id);

  const handleCopy = () => {
    navigator.clipboard.writeText(paste.content);
    alert("Copied Successfully!");
  };

  const handleOpenLink = () => {
  if (!paste?.content) {
    alert("No content found!");
    return;
  }

  const urlRegex =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/i;

  const match = paste.content.match(urlRegex);

  if (!match) {
    alert("No valid link found!");
    return;
  }

  let url = match[0];

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

  if (!paste) {
    return (
      <div className="p-10 text-red-500 text-center dark:bg-slate-950 dark:text-red-400 min-h-screen transition-all duration-300">
        Note not found 😞
      </div>
    );
  }

  return (
    <div
      className="
        max-w-4xl mx-auto px-6 py-10
        bg-white dark:bg-slate-950
        min-h-screen
        transition-all duration-300
      "
    >
      <div className="flex flex-col gap-5">

        {/* Title */}
        <input
          className="
            p-3 rounded-md
            bg-gray-100 dark:bg-slate-900
            text-lg font-semibold
            text-gray-800 dark:text-white
            border border-gray-300 dark:border-slate-700
            cursor-not-allowed
            transition-all duration-300
          "
          type="text"
          value={paste.title}
          disabled
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="
              px-4 py-2
              bg-blue-600 hover:bg-blue-700
              text-white
              rounded-lg
              transition-all duration-300
            "
          >
            📋 Copy
          </button>

          {/* Open In Browser */}
          <button
            onClick={handleOpenLink}
            className="
              px-4 py-2
              bg-green-600 hover:bg-green-700
              text-white
              rounded-lg
              transition-all duration-300
            "
          >
            🌐 Open in Browser
          </button>
        </div>

        {/* Content */}
        <textarea
          className="
            p-4 rounded-md
            bg-gray-100 dark:bg-slate-900
            text-gray-800 dark:text-gray-200
            border border-gray-300 dark:border-slate-700
            text-base leading-relaxed
            min-h-[400px]
            transition-all duration-300
          "
          value={paste.content}
          disabled
          rows={20}
        />
      </div>
    </div>
  );
};

export default ViewPaste;