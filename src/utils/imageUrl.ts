import { API_URL } from "../config/api";

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" rx="48" fill="#F7F3FF"/>
  <circle cx="300" cy="255" r="72" fill="#E9D5FF"/>
  <rect x="170" y="350" width="260" height="38" rx="19" fill="#D8B4FE"/>
  <rect x="210" y="410" width="180" height="24" rx="12" fill="#C084FC"/>
  <text x="300" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#4B1E78">CosmoCartt</text>
</svg>
`);

export const getImageUrl = (image?: string) => {
  if (!image || String(image).trim() === "") {
    return FALLBACK_IMAGE;
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
