export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* LABEL */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        ABOUT THE HOUSE
      </p>

      {/* TITLE */}

      <h1
        className="
          text-6xl
          md:text-8xl
          font-light
          tracking-[0.15em]
          mb-20
        "
      >
        AVENOR
      </h1>

      {/* INTRO */}

      <div className="max-w-4xl mb-20">
        <p
          className="
            text-2xl
            md:text-3xl
            font-light
            leading-relaxed
            text-gray-800
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Avenor is a cultural expression of Indian
          artistry, craftsmanship, and timeless
          elegance.
        </p>
      </div>

      {/* STORY */}

      <div className="grid lg:grid-cols-2 gap-16">

        <p className="text-gray-600 leading-9 text-lg">
          Rooted in heritage yet designed for the
          modern world, the brand seeks to bring
          the beauty of Indian craftsmanship to a
          global audience that values excellence,
          artistry, and authenticity.

          <br />
          <br />

          Every creation reflects a dialogue
          between tradition and contemporary
          refinement, celebrating the skill,
          detail, and stories carried through
          generations of artisans.
        </p>

        <p className="text-gray-600 leading-9 text-lg">
          At Avenor, fashion is more than clothing
          — it is a representation of culture,
          identity, and enduring craftsmanship.

          <br />
          <br />

          By blending authentic Indian techniques
          with a global luxury aesthetic, Avenor
          aspires to create a presence where
          Indian artistry is valued not only for
          its beauty, but for its legacy,
          excellence, and cultural significance
          across the world.
        </p>

      </div>

      {/* SIGNATURE */}

      <div className="mt-32 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
          DESIGNED WITH INTENTION
        </p>

        <p
          className="
            text-3xl
            md:text-4xl
            font-light
            text-gray-800
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Modern Couture.
          <br />
          Silent Luxury.
          <br />
          Crafted With Intention.
        </p>

      </div>

    </main>
  );
}
