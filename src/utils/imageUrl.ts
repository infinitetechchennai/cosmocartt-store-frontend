import { API_URL } from "../config/api";

export const getImageUrl = (image?: string) => {
  if (!image) {
    return "https://via.placeholder.com/400x400?text=No+Image";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_URL}${image}`;
};
