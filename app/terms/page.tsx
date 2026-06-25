export default function TermsPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        LEGAL INFORMATION
      </p>

      <h1
        className="
          text-5xl
          md:text-7xl
          font-light
          tracking-[0.12em]
          mb-20
        "
      >
        TERMS &
        <br />
        CONDITIONS
      </h1>

      {/* INTRO */}

      <div className="max-w-4xl mb-24">
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
          By accessing Avenor and placing an order,
          you agree to the terms, policies, and
          client service standards outlined below.
        </p>
      </div>

      {/* TERMS */}

      <div className="space-y-20">

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            AVAILABILITY
          </p>

          <p className="text-lg text-gray-600 leading-9">
            All products are subject to availability.
            Many Avenor garments are produced in
            limited quantities or on a made-to-order
            basis, and availability may vary between
            collections.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            ORDERS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Orders are confirmed only after
            successful payment. Avenor reserves the
            right to refuse or cancel orders in
            cases of pricing inaccuracies,
            inventory issues, suspected fraud, or
            circumstances beyond reasonable
            control.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCTS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Product photographs are provided for
            illustrative purposes. Minor variations
            in colour, texture, embroidery,
            craftsmanship, and finishing may occur
            due to the handmade nature of our
            garments and are not considered
            defects.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRICING
          </p>

          <p className="text-lg text-gray-600 leading-9">
            All prices are listed in Indian Rupees
            (INR). Prices, availability, and product
            information may be updated without
            prior notice.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            CANCELLATIONS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Due to the made-to-order nature of many
            Avenor pieces, orders cannot be modified
            or cancelled once production has begun.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            CUSTOMER INFORMATION
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Customers are responsible for providing
            accurate billing, shipping, and contact
            information. Avenor is not responsible
            for delays or losses resulting from
            incorrect information supplied during
            checkout.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            ACCEPTANCE
          </p>

          <p className="text-lg text-gray-600 leading-9">
            By using this website and placing an
            order, you acknowledge and agree to
            these Terms & Conditions together with
            all related policies published by
            Avenor.
          </p>
        </section>

      </div>

      {/* FOOTER */}

      <div className="mt-28 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
          ACKNOWLEDGEMENT
        </p>

        <p
          className="
            text-3xl
            md:text-4xl
            font-light
            leading-relaxed
            max-w-3xl
            mx-auto
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          By continuing to use this website,
          you acknowledge and agree to the
          standards and policies of Avenor.
        </p>

        <p className="mt-12 text-gray-500">
          Questions regarding these terms may be
          directed to
        </p>

        <a
          href="mailto:support@avenorcollection.com"
          className="
            mt-3
            inline-block
            text-black
            tracking-[0.2em]
            hover:opacity-60
            transition
          "
        >
          support@avenorcollection.com
        </a>

      </div>

    </main>
  );
}
