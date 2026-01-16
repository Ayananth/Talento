import { X, Download } from "lucide-react";
import { useEffect } from "react";

const ImagePreviewModal = ({ src, fileName, onClose }) => {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Stop click propagation */}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:opacity-80"
        >
          <X size={28} />
        </button>

        {/* Download */}
        <a
         href={`${src.replace("/upload/", "/upload/fl_attachment/")}`}

          download={fileName}
          className="absolute -top-10 right-12 text-white hover:opacity-80"
        >
          <Download size={24} />
        </a>

        {/* Image */}
        <img
          src={src}
          alt={fileName}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
