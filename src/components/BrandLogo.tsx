import { useState } from "react";
import { getImageUrl } from "../utils/imageUrl";
import { getBrandInitials, getBrandLogoUrl } from "../utils/brandLogo";

type BrandLogoProps = {
  brandName: string;
  fallbackImage?: string;
  className?: string;
};

export default function BrandLogo({
  brandName,
  fallbackImage,
  className = "",
}: BrandLogoProps) {
  const logoUrl = getBrandLogoUrl(brandName);
  const fallbackUrl = fallbackImage ? getImageUrl(fallbackImage) : "";
  const [failedLogo, setFailedLogo] = useState(false);
  const [failedFallback, setFailedFallback] = useState(false);

  const src = !failedLogo && logoUrl
    ? logoUrl
    : !failedFallback && fallbackUrl
      ? fallbackUrl
      : "";

  if (src) {
    return (
      <img
        src={src}
        alt={`${brandName} logo`}
        className={className}
        loading="lazy"
        onError={() => {
          if (!failedLogo && logoUrl) {
            setFailedLogo(true);
          } else {
            setFailedFallback(true);
          }
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-[#4B1E78] font-black text-2xl">
      {getBrandInitials(brandName)}
    </div>
  );
}
