const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateFile = (file, allowedTypes, maxSize) => {
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type";
  }
  if (file.size > maxSize) {
    return "File size exceeds limit";
  }
  return null;
};


export {
  MAX_LOGO_SIZE,
  MAX_DOC_SIZE,
  isValidEmail,
  isValidURL,
  validateFile
};