const BRAND_LOGO_SLUGS: Record<string, string> = {
  apple: "apple",
  samsung: "samsung",
  oneplus: "oneplus",
  oppo: "oppo",
  vivo: "vivo",
  xiaomi: "xiaomi",
  redmi: "xiaomi",
  poco: "poco",
  realme: "realme",
  motorola: "motorola",
  lenovo: "lenovo",
  hp: "hp",
  dell: "dell",
  asus: "asus",
  acer: "acer",
  sony: "sony",
  lg: "lg",
  google: "google",
  "google pixel": "google",
  nothing: "nothing",
  infinix: "infinix",
  iqoo: "iqoo",
  boat: "boAt",
  jbl: "jbl",
  zebronics: "zebronics",
  portronics: "portronics",
  logitech: "logitech",
  canon: "canon",
  nikon: "nikon",
  epson: "epson",
  brother: "brother",
  panasonic: "panasonic",
  philips: "philips",
};

export const getBrandLogoUrl = (brandName = "") => {
  const normalized = brandName.trim().toLowerCase();

  if (!normalized) return "";

  const slug =
    BRAND_LOGO_SLUGS[normalized] ||
    BRAND_LOGO_SLUGS[normalized.replace(/\s+/g, " ")];

  if (!slug) return "";

  return `https://cdn.simpleicons.org/${slug}`;
};

export const getBrandInitials = (brandName = "") => {
  return brandName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "BR";
};
