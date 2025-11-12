"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(1);

  const images = [
    { id: 1, src: "/litiere-1.jpg", alt: "Litière SteelCat - Vue principale" },
    { id: 2, src: "/litiere-2.jpg", alt: "Litière SteelCat - Vue détail" },
    { id: 3, src: "/litiere-3.jpg", alt: "Litière SteelCat - Texture" },
    { id: 4, src: "/litiere-4.jpg", alt: "Litière SteelCat - Packaging" },
    { id: 5, src: "/litiere-5.jpg", alt: "Litière SteelCat - Utilisation" },
    { id: 6, src: "/litiere-6.jpg", alt: "Litière SteelCat - Vue d'ensemble" },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Découvrez SteelCat en détail
          </h2>
          <p className="text-xl text-gray-600">
            Une litière premium qui allie esthétique et performance
          </p>
        </div>

        {/* Image principale */}
        <div className="mb-8">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={images.find(img => img.id === selectedImage)?.src || images[0].src}
              alt={images.find(img => img.id === selectedImage)?.alt || images[0].alt}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Miniatures */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                selectedImage === image.id
                  ? "ring-4 ring-black shadow-lg scale-105"
                  : "ring-2 ring-gray-200 hover:ring-gray-400"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
