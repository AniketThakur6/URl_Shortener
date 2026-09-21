import React, { useState } from "react";
import {
  ChartNoAxesColumn,
  ClipboardCheck,
  Copy,
  QrCode,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import MyQRCode from "./MyQRCode";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { toast } from "react-toastify";

const ResultCard = ({ url, openQrId, setOpenQrId, deleteApi }) => {
  const [copy, setCopy] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const domain = url?.originalUrl ? new URL(url.originalUrl).hostname : null;

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleCopy = async () => {
    console.log("hello");
    await navigator.clipboard.writeText(
      `http://localhost:3000/${url.shortCode}`,
    );

    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 10000);
  };

  const isQrOpen = openQrId === url?._id;
  const onQrToggle = () =>
    setOpenQrId((currentId) => (currentId === url._id ? null : url._id));

  const confirmDelete = async () => {
    await deleteApi(url._id);
    toast.success("Deleted successfully");
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row ml-1 gap-3 lg:gap-0 items-stretch lg:items-center lg:flex-nowrap min-h-15 bg-zinc-900 border-2 border-gray-500 rounded-lg w-full p-2 md:p-3">
      <div className="flex min-w-0 flex-1 items-start lg:items-center gap-3">
        <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 flex items-center">
          <img src={favicon} alt="" className="w-7 h-7 md:w-8 md:h-8" />
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-1 leading-5 lg:flex-row lg:items-center lg:gap-5">
          <a
            href={`http://localhost:3000/${url.shortCode}`}
            target="_blank"
            className="flex lg:shrink-0 text-amber-500 font-medium hover:underline transition-all"
          >
            {url?.shortCode}
          </a>
          <p className="min-w-0 flex-1 text-gray-400 truncate">{url?.originalUrl}</p>
        </div>
        <span className="md:hidden flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-400">
          <ChartNoAxesColumn size={18} stroke="#99A1AF" /> {url.clicks} Clicks
        </span>
      </div>
      <div className="hidden md:grid md:grid-cols-2 gap-2 lg:flex lg:flex-nowrap lg:items-center lg:justify-end lg:shrink-0">
        <span className="col-span-2 flex whitespace-nowrap text-base sm:text-lg font-medium text-gray-400 items-center gap-1.5 mx-0 lg:mx-5">
          <ChartNoAxesColumn size={22} stroke="#99A1AF" /> {url.clicks} Clicks
        </span>
        <a
          href={`http://localhost:3000/${url.shortCode}`}
          target="_blank"
          className="flex w-full cursor-pointer items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250 lg:whitespace-nowrap"
        >
          <SquareArrowOutUpRight size={20} />
          Visit URL
        </a>
        <div className="relative flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQrToggle();
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250"
          >
            <QrCode size={20} /> QR
          </button>
          {isQrOpen && (
            <div className="absolute top-5 left-10 z-10">
              <MyQRCode url={url} onClose={onQrToggle} />
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex w-full cursor-pointer items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250"
        >
          {copy ? (
            <>
              <ClipboardCheck size={20} /> Copied
            </>
          ) : (
            <>
              <Copy size={20} /> Copy
            </>
          )}
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250"
        >
          <Trash size={20} /> Delete
        </button>
      </div>
      <div className="grid md:hidden grid-cols-5 gap-2 w-full">
        <button onClick={handleCopy} className="col-span-2 flex w-full flex-nowrap cursor-pointer items-center justify-center gap-1 whitespace-nowrap px-2 py-1.5 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250">{copy ? <ClipboardCheck size={18} /> : <Copy size={18} />}<span>{copy ? "Copied" : "Copy"}</span></button>
        <button onClick={(event) => { event.stopPropagation(); onQrToggle(); }} aria-label="Show QR code" className="col-span-1 flex w-full cursor-pointer items-center justify-center gap-1 px-2 py-1.5 rounded bg-amber-600 hover:bg-amber-700 transition-colors duration-250"><QrCode size={18} /></button>
        <a href={`http://localhost:3000/${url.shortCode}`} target="_blank" aria-label="Visit URL" className="col-span-1 flex items-center justify-center rounded bg-amber-600 px-2 py-1.5"><SquareArrowOutUpRight size={18} /></a>
        <button onClick={() => setIsDeleteOpen(true)} aria-label="Delete" className="col-span-1 flex items-center justify-center rounded bg-amber-600 px-2 py-1.5"><Trash size={18} /></button>
        {isQrOpen && <div className="col-span-5 flex justify-center"><MyQRCode url={url} onClose={onQrToggle} /></div>}
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ResultCard;
