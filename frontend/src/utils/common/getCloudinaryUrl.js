export const getCloudinaryUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  return `https://res.cloudinary.com/dycb8cbf8/${path}`;
};
