"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

type Props = {
  images: string[];
  name: string;
};

export default function ProductGallery({
  images,
  name,
}: Props) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const [touchStartX, setTouchStartX] =
    useState<number | null>(null);

  const [touchEndX, setTouchEndX] =
    useState<number | null>(null);

  const minSwipeDistance = 50;

  // Preload all images
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const onTouchMove = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (
      touchStartX === null ||
      touchEndX === null
    )
      return;

    const distance =
      touchStartX - touchEndX;

    if (
      distance > minSwipeDistance &&
      !isTransitioning
    ) {
      next();
    }

    if (
      distance < -minSwipeDistance &&
      !isTransitioning
    ) {
      prev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const prev = useCallback(() => {
    if (
      isTransitioning ||
      images.length <= 1
    )
      return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIndex((i) =>
        i === 0
          ? images.length - 1
          : i - 1
      );

      setIsTransitioning(false);
    }, 180);
  }, [images.length, isTransitioning]);

  const next = useCallback(() => {
    if (
      isTransitioning ||
      images.length <= 1
    )
      return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIndex((i) =>
        i === images.length - 1
          ? 0
          : i + 1
      );

      setIsTransitioning(false);
    }, 180);
  }, [images.length, isTransitioning]);

  return (
    <div className="w-full">
      <section
        className="
          group
          relative
          w-full
          h-[70vh]
          max-h-[70vh]
          overflow-hidden
          bg-ivory
        "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* IMAGE */}
        <img
          src={images[index]}
          alt={name}
          className={`w-full h-full object-contain object-center transition-opacity duration-300 ${
            isTransitioning
              ? "opacity-80"
              : "opacity-100"
          }`}
        />

        {/* LEFT ARROW */}
        <button
          onClick={prev}
          aria-label="Previous image"
          disabled={isTransitioning}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            z-20
            text-5xl
            font-light
            text-charcoal
            opacity-70
            hover:opacity-100
            disabled:opacity-30
            transition
          "
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          aria-label="Next image"
          disabled={isTransitioning}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            z-20
            text-5xl
            font-light
            text-charcoal
            opacity-70
            hover:opacity-100
            disabled:opacity-30
            transition
          "
        >
          ›
        </button>
      </section>

      {/* COUNTER */}
      <div className="flex justify-center mt-4">
        <div
          className="
            px-4 py-1.5
            rounded-lg
            text-sm font-medium
            text-gray-700
            border border-gray-400/40
            bg-transparent
            backdrop-blur-sm
          "
        >
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
