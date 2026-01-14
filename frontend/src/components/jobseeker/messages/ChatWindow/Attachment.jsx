export const Attachment = ({ attachment }) => {
  const { file_url, file_name, file_type, file_size } = attachment;

  const isImage = file_type?.startsWith("image/");
  const icon = getFileIcon(file_type);

  // Image preview
  if (isImage) {
    return (
      <img
        src={file_url}
        alt={file_name}
        className="mt-2 max-w-[200px] rounded cursor-pointer"
      />
    );
  }

  // PDF / DOC / others
  return (
    <a
      href={file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 rounded-md bg-white/20 px-2 py-1 text-sm hover:bg-white/30"
    >
      <span className="text-lg">{icon}</span>

      <span className="truncate max-w-[160px]">
        {file_name}
      </span>

      {file_size && (
        <span className="text-xs opacity-70">
          {(file_size / 1024).toFixed(1)} KB
        </span>
      )}
    </a>
  );
};



const getFileIcon = (fileType) => {
  if (!fileType) return "📎";

  if (fileType === "application/pdf") return "📄";
  if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "📝";

  if (fileType.startsWith("image/")) return "🖼️";

  return "📎";
};

