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
          min-h-[60vh]
          lg:min-h-[72vh]
          bg-ivory
        "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* LEFT PANEL */}
        <div
          className="
            absolute
            left-2
            md:left-6
            top-1/2
            -translate-y-1/2
            flex
            flex-col
            items-center
            gap-5
            z-20
          "
        >
          <button
            onClick={prev}
            disabled={isTransitioning}
            className="
              text-3xl
              font-light
              text-gray-500
              hover:text-black
              transition
              disabled:opacity-30
            "
          >
            &lt;
          </button>

          <p
            className="
              text-sm
              text-gray-500
              tracking-[0.2em]
              font-light
              select-none
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            {index + 1} / {images.length}
          </p>

          <button
            onClick={next}
            disabled={isTransitioning}
            className="
              text-3xl
              font-light
              text-gray-500
              hover:text-black
              transition
              disabled:opacity-30
            "
          >
            &gt;
          </button>
        </div>

        {/* IMAGE */}
        <div
          className="
            relative
            w-full
            max-w-[380px]
            md:max-w-[550px]
            lg:max-w-[680px]
            aspect-[3/4]
            flex
            items-center
            justify-center
            bg-ivory
          "
        >
          <img
            src={images[index]}
            alt={name}
            className={`
              max-w-full
              max-h-full
              object-contain
              object-center
              cursor-pointer
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
      </section>
    </div>
  );
}
