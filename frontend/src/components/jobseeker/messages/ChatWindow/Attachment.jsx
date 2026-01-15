import { useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

export const Attachment = ({ attachment }) => {
  const { file_url, file_name, file_type, file_size } = attachment;
  const isImage = file_type?.startsWith("image/");
  const [open, setOpen] = useState(false);

  if (isImage) {
    return (
      <>
        <img
          src={file_url}
          alt={file_name}
          onClick={() => setOpen(true)}
          className="mt-2 max-w-[200px] rounded cursor-pointer hover:opacity-90"
        />

        {open && (
          <ImagePreviewModal
            src={file_url}
            fileName={file_name}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  // Non-image attachments (PDF / DOC)
  return (
    <a
    //   href={file_url} //open in preview
    //  href={file_url.replace("/upload/", "/upload/fl_attachment/")} //download
    //   href={file_url.replace("/upload/", "/upload/fl_inline/")} // Open in browser tab
    href={getCloudinaryUrl(file_url, "download")}

      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 rounded-md bg-white/20 px-2 py-1 text-sm hover:bg-white/30"
    >
      📄 {file_name}
      {file_size && (
        <span className="text-xs opacity-70">
          {(file_size / 1024).toFixed(1)} KB
        </span>
      )}
    </a>
  );
};



const getCloudinaryUrl = (url, mode) => {
  if (!url.includes("/upload/")) return url;

  if (mode === "inline") {
    return url.replace("/upload/", "/upload/fl_inline/");
  }

  if (mode === "download") {
    return url.replace("/upload/", "/upload/fl_attachment/");
  }

  return url;
};

