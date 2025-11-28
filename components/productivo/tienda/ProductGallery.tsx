"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images.length) {
    return (
      <div className="aspect-square bg-base-200 rounded-lg flex items-center justify-center">
        <span className="text-8xl">📦</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-base-200 rounded-lg overflow-hidden relative">
        <Image src={selectedImage} alt={name} fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`aspect-square bg-base-200 rounded overflow-hidden relative border-2 transition-colors ${
                selectedImage === img ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
