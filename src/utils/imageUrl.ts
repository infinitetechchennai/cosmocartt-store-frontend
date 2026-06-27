import { API_URL } from "../config/api";

export const getImageUrl = (image?: string) => {
  if (!image || String(image).trim() === "") {
    return "https://via.placeholder.com/400x400?text=No+Image";
  }

  const cleanImage = String(image).trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:") ||
    cleanImage.startsWith("blob:")
  ) {
    return cleanImage;
  }

  if (cleanImage.startsWith("/")) {
    return `${API_URL}${cleanImage}`;
  }

  return `${API_URL}/${cleanImage}`;
};
