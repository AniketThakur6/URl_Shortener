import { Link2, PencilLine, QrCode, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ShortenForm = ({ setFormInput, createUrl }) => {
  const [input, setInput] = useState({
    url: "",
    alias: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = input.url.trim();
    const alias = input.alias.trim();

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        toast.error("Only HTTP and HTTPS URLs are allowed.");
        return;
      }
    } catch (error) {
      toast.error("Only HTTP and HTTPS URLs are allowed. catch");
      return;
    }

    if (url.length > 2048) {
      toast.error("URL is too long");
      return;
    }

    if (alias && !/^[a-zA-Z0-9-_]+$/.test(alias)) {
      toast.error(
        "Alias may contain only letters, numbers, hyphens, and underscores.",
      );
      return;
    }

    const formData = {
      url,
      alias,
    };

    setInput({
      url: "",
      alias: "",
    });

    createUrl(formData);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row p-1 gap-3 justify-center"
      >
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <p className="flex items-center gap-2 font-medium select-none">
              <Send stroke="#E17100" size={15} /> Long URL
            </p>
            <input
              onChange={handleChange}
              name="url"
              value={input.url}
              className="flex border border-gray-500 outline-none bg-zinc-900 rounded-lg px-5 py-3"
              type="text"
              placeholder="Paste a long URL here…"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 font-medium select-none">
              <PencilLine stroke="#E17100" size={15} />
              Alias (optional)
            </p>
            <input
              onChange={handleChange}
              name="alias"
              value={input.alias}
              className="flex w-full sm:w-60 border border-gray-500 outline-none bg-zinc-900 rounded-lg px-5 py-3"
              type="text"
              placeholder="Add alias here…"
            />
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 transition-colors duration-250 flex gap-2 items-center justify-center cursor-pointer px-4 py-3 rounded-lg"
          >
            <Link2 />
            Shorten
          </button>
          {/* <button className="bg-amber-600 hover:bg-amber-700 transition-colors duration-250 flex gap-2 items-center cursor-pointer px-4 py-3 rounded-lg">
            <QrCode size={23} />
            Generate QR
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default ShortenForm;
