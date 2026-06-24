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
          relative
          flex
          justify-center
          items-center
          w-full
          min-h-[48vh]
          md:min-h-[58vh]
          bg-ivory
        "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* LEFT ARROW */}
        <button
          onClick={prev}
          aria-label="Previous image"
          disabled={isTransitioning}
          className="
            absolute
            left-4
            md:left-6
            top-1/2
            -translate-y-1/2
            z-20
            text-4xl
            md:text-5xl
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

        {/* IMAGE */}
        <div
          className="
            relative
            w-full
            max-w-[260px]
            md:max-w-sm
            aspect-[3/4]
            overflow-hidden
            rounded-lg
            bg-ivory
          "
        >
          <img
            src={images[index]}
            alt={name}
            className={`
              w-full
              h-full
              object-contain
              object-center
              transition-opacity
              duration-300
              ${
                isTransitioning
                  ? "opacity-80"
                  : "opacity-100"
              }
            `}
          />
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          aria-label="Next image"
          disabled={isTransitioning}
          className="
            absolute
            right-4
            md:right-6
            top-1/2
            -translate-y-1/2
            z-20
            text-4xl
            md:text-5xl
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
      <div className="flex justify-center mt-1">
        <div
          className="
            px-3
            py-1
            rounded-full
            bg-ivory/70
            backdrop-blur-sm
            border border-gray-200/50
            text-gray-500
            text-sm
            tracking-[0.15em]
            font-light
            select-none
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
