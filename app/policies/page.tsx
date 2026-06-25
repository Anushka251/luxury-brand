export default function PoliciesPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        HOUSE POLICIES
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
        POLICIES
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
          Every Avenor garment is created in
          limited quantities with an emphasis on
          craftsmanship, intention, and enduring
          design.
        </p>
      </div>

      {/* POLICY SECTIONS */}

      <div className="space-y-20">

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCTION
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Avenor pieces are produced in limited
            quantities and many garments are
            prepared on a made-to-order basis.
            Every piece is carefully finished with
            attention to construction, materials,
            and detail.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PAYMENT
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Orders are confirmed only after full
            payment has been successfully received.
            Cash on Delivery is not currently
            available.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            AVAILABILITY
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Product availability is limited.
            Certain pieces may not be restocked
            after a collection has sold out.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCT
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Variations in colour, texture, and
            appearance may occur because of
            photography, lighting conditions,
            display settings, and the natural
            characteristics of materials.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRIVACY
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Customer information is collected
            solely for order processing, client
            services, and communication regarding
            purchases. Personal information is
            never sold or shared except where
            required to fulfil orders or comply
            with legal obligations.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            TERMS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Product specifications, pricing,
            availability, and policies may be
            updated without notice. Avenor
            reserves the right to refuse or cancel
            orders resulting from pricing errors,
            fraudulent activity, or circumstances
            beyond reasonable control.
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
          By accessing this website and placing
          an order, you acknowledge and agree
          to the policies and client service
          standards outlined by Avenor.
        </p>

        <p className="mt-12 text-gray-500">
          Questions regarding your order or our
          policies may be directed to
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
