"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  interval?: number;
};

export default function ImageCarousel({ images, interval = 4000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
      <Image
        src={images[index]}
        alt="Workout preview"
        fill
        className="object-cover transition-opacity duration-700"
        priority
      />
    </div>
  );
}
