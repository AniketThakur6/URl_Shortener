import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, X } from "lucide-react";

const MyQRCode = ({ url, onClose }) => {
  const [favicon, setFavicon] = useState(null);

  useEffect(() => {
    fetch("/favicon.png")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          setFavicon(reader.result);
        };

        reader.readAsDataURL(blob);
      });
  }, []);

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = () => {
      const scale = 4;

      const canvas = document.createElement("canvas");

      canvas.width = 160 * scale;
      canvas.height = 160 * scale;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(svgUrl);

      const pngUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngUrl;
      const fileName = `${url.shortCode}`;
      link.download = `${fileName}.png`;

      link.click();
    };

    img.src = svgUrl;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col gap-4 overflow-y-auto rounded-xl border-2 border-gray-500 bg-zinc-900 p-4 sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-amber-500">
              {url.shortCode}
            </p>
            <p className="truncate text-sm text-gray-400">{url.originalUrl}</p>
          </div>
          
        </div>
        <div className="flex justify-center">
          <QRCodeSVG
            className="h-auto w-full max-w-60 rounded-xl border-6 border-amber-600"
            id="qr-code"
            value={`http://localhost:3000/${url.shortCode}`}
            size={160}
            level="H"
            bgColor="#f3dec9"
            marginSize={2}
            imageSettings={{
              src: favicon,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 transition-colors duration-250 hover:bg-amber-700"
          >
            <Download size={20} /> Download QR
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-500 px-3 py-2 text-gray-200 transition-colors duration-250 hover:bg-zinc-700"
          >
            <X size={20} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyQRCode;
