"use client";

import { useState } from "react";

const FALLBACK_IMAGE = "/images/recipes/pizza-fallback.jpg";

export default function RecipeImage({ src, alt, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = !src || failedSrc === src ? FALLBACK_IMAGE : src;
  const isFallback = imageSrc === FALLBACK_IMAGE;

  return (
    <img
      {...props}
      src={imageSrc}
      alt={isFallback ? `${alt || "Recipe"} (illustrative pizza photo)` : alt}
      onError={() => {
        if (!isFallback) setFailedSrc(src);
      }}
    />
  );
}
