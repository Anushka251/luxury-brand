export default function PoliciesPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        INFORMATION
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

      <div className="space-y-20">

        {/* PRODUCTION */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCTION
          </p>

          <p className="text-lg text-gray-600 leading-9">
            All Avenor pieces are crafted in limited
            quantities and produced on a made-to-order
            basis. Each garment is carefully prepared
            in-house with attention to detail,
            construction, and finish.
          </p>
        </section>

        {/* PAYMENT */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PAYMENT
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Orders are processed only after full
            payment has been received. We currently
            do not offer Cash on Delivery as every
            piece is produced specifically for each
            order.
          </p>
        </section>

        {/* SHIPPING */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            SHIPPING
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Production and dispatch generally require
            7–14 business days. Once your order has
            been shipped, tracking information will
            be provided via email.
          </p>
        </section>

        {/* PRODUCT */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCT
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Due to lighting conditions, photography,
            screen calibration, and device displays,
            colours may appear slightly different
            from the final garment. Such variations
            are considered a natural characteristic
            of the materials and craftsmanship used.
          </p>
        </section>

        {/* PRIVACY */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRIVACY
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Customer information including name,
            email address, phone number, and
            shipping details is collected solely
            for processing orders, providing
            support, and improving the customer
            experience. Avenor does not sell or
            share customer information except when
            required to fulfil orders or comply
            with legal obligations.
          </p>
        </section>

        {/* TERMS */}

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            TERMS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Product availability, pricing, and
            specifications may be updated without
            notice. Avenor reserves the right to
            refuse or cancel orders in cases of
            pricing errors, suspected fraudulent
            activity, or circumstances beyond our
            reasonable control.
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
            text-2xl
            md:text-3xl
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
          to the policies outlined above.
        </p>

        <p className="mt-12 text-gray-500">
          For questions regarding your order,
          shipping, or policies, please contact
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
