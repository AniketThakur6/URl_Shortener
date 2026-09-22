import React, { useEffect, useState } from "react";
import ShortenForm from "./components/ShortenForm";
import ResultCard from "./components/ResultCard";
import UrlList from "./components/UrlList";
import api from "./apis/api";
import { RefreshCw } from "lucide-react";

const App = () => {
  const [urls, setUrls] = useState([]);
  const [CurrentUrl, setCurrentUrl] = useState(null);
  const [openQrId, setOpenQrId] = useState(null);

  const fetchUrls = async () => {
    const response = await api.get("/");
    setUrls(response?.data?.data?.urls);
    setCurrentUrl(response?.data?.data?.urls[0]);
  };

  const createUrl = async (formData) => {
    const response = await api.post("/", formData);
    setCurrentUrl(response.data.data);

    fetchUrls();
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleQr = () => {
    setOpenQrId(null);
  };

  const deleteApi = async (id) => {
    await api.delete(`/${id}`);
    fetchUrls();
  };

  return (
    <div
      onClick={handleQr}
      className="min-h-screen flex flex-col justify-between bg-black text-white text-lg px-4 pt-8 pb-2 sm:px-8 sm:pt-12 md:px-12 lg:px-20 lg:pt-16 xl:px-32 2xl:px-50"
    >
      <div className="flex flex-1 flex-col gap-5 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-1 self-start">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 select-none">
            Long links?
          </h1>
          <p className="text-md text-gray-300 select-none">
            Paste a link, get a short one, see how many people clicked it.
            *(link expires after 30 days)*
          </p>
        </div>
        <ShortenForm createUrl={createUrl} />
        {urls?.length !== 0 && (
          <p className="font-semibold select-none">Current links</p>
        )}
        {CurrentUrl ? (
          <ResultCard
            key={CurrentUrl?.id}
            url={CurrentUrl}
            openQrId={openQrId}
            setOpenQrId={setOpenQrId}
            deleteApi={deleteApi}
          />
        ) : null}
        <div className="flex flex-row justify-between select-none items-center">
          <p className="font-semibold select-none">
            Your links{" "}
            <span>({urls?.length - 1 === -1 ? 0 : urls?.length - 1})</span>
          </p>
          <button
            onClick={fetchUrls}
            aria-label="Refresh links"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md cursor-pointer bg-amber-600 hover:bg-amber-700 transition-colors duration-250 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-2"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {urls?.slice(1).map((url) => (
            <UrlList
              key={url._id}
              url={url}
              openQrId={openQrId}
              setOpenQrId={setOpenQrId}
              deleteApi={deleteApi}
            />
          ))}
        </div>
      </div>
      <footer className="mt-12 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
        <p>
          © 2026 URL Shortener · More info on{" "}
          <a
            href="https://github.com/AniketThakur6/URl_Shortener"
            target="_blank"
            className="text-amber-500 cursor-pointer hover:underline transition-all hover:text-amber-400"
          >
            here.
          </a>
        </p>
        <a
          href="https://github.com/AniketThakur6"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-amber-500 transition-colors hover:text-amber-400"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            aria-hidden="true"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            fillRule="evenodd"
          >
            <path d="M24,2.5a21.5,21.5,0,0,0-6.8,41.9c1.08.2,1.47-.46,1.47-1s0-1.86,0-3.65c-6,1.3-7.24-2.88-7.24-2.88A5.7,5.7,0,0,0,9,33.68c-1.95-1.33.15-1.31.15-1.31a4.52,4.52,0,0,1,3.29,2.22c1.92,3.29,5,2.34,6.26,1.79a4.61,4.61,0,0,1,1.37-2.88c-4.78-.54-9.8-2.38-9.8-10.62a8.29,8.29,0,0,1,2.22-5.77,7.68,7.68,0,0,1,.21-5.69s1.8-.58,5.91,2.2a20.46,20.46,0,0,1,10.76,0c4.11-2.78,5.91-2.2,5.91-2.2a7.74,7.74,0,0,1,.21,5.69,8.28,8.28,0,0,1,2.21,5.77c0,8.26-5,10.07-9.81,10.61a5.12,5.12,0,0,1,1.46,4c0,2.87,0,5.19,0,5.9s.39,1.24,1.48,1A21.5,21.5,0,0,0,24,2.5" />
          </svg>
          Aniket Thakur
        </a>
      </footer>
    </div>
  );
};

export default App;
