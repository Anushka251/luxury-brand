export default function AboutPage() {
  return (
    <div className="px-12 py-28 max-w-3xl mx-auto text-sm leading-8 text-gray-700">
      
      {/* TITLE */}
      <h1 className="text-4xl tracking-[0.2em] mb-12 text-maroon font-light">
        AVENOR
      </h1>

      {/* STORY */}
      <p className="mb-6">
        AVENOR is a quiet expression of modern luxury — where design is intentional,
        and every detail is considered.
      </p>

      <p className="mb-6">
        Each piece is developed and made in-house, with a focus on form, fabric, and feeling.
        We do not follow seasons or trends — we create with permanence in mind.
      </p>

      <p className="mb-6">
        Every garment is produced in limited quantities and crafted individually.
        Once an order is placed, the making and shipping of each piece typically takes
        between 7–14 days.
      </p>

      <p className="mb-6">
        Because each piece is made specifically for you, returns are accepted at 50% of the order value.
        Exchanges are available at an additional 50%, subject to availability.
      </p>

      <p className="mb-6">
        We operate in limited drops with a restricted number of pieces, ensuring
        exclusivity and attention to detail in every order.
      </p>

      <p className="mb-6">
        As a growing label, we currently do not offer cash on delivery. All orders are
        prepaid to maintain the integrity of our made-to-order process.
      </p>

      <p className="mb-6">
        We believe clothing should not demand attention — it should hold it.
      </p>

      {/* SIGNATURE LINE */}
      <p className="mt-12 text-xs tracking-[0.3em] text-gray-500">
        DESIGNED WITH INTENTION
      </p>

      {/* 🔥 CONTACT / SOCIALS */}
      <div className="mt-16 border-t pt-10 text-xs tracking-widest text-gray-500 space-y-4">
        
        <a
          href="https://instagram.com/anushka__m25"
          target="_blank"
          className="block hover:text-black transition"
        >
          INSTAGRAM
        </a>

        <a
          href="https://pinterest.com/anushkam251"
          target="_blank"
          className="block hover:text-black transition"
        >
          PINTEREST
        </a>

        <a
          href="mailto:youremail@avenor.com"
          className="block hover:text-black transition"
        >
          CONTACT
        </a>

      </div>
    </div>
  );
}