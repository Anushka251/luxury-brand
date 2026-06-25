export default function ReturnsPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        CLIENT SERVICES
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
        RETURNS &
        <br />
        EXCHANGES
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
          Every Avenor piece is produced in
          limited quantities and created
          specifically for its client.
        </p>
      </div>

      {/* POLICY SECTIONS */}

      <div className="space-y-20">

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            RETURNS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Due to the made-to-order nature of our
            garments and the limited availability
            of each collection, all sales are
            considered final. We do not accept
            returns or provide refunds.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            EXCHANGES
          </p>

          <p className="text-lg text-gray-600 leading-9">
            As pieces are produced in limited
            quantities, exchanges cannot be
            guaranteed and are not currently
            offered.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            SIZING ASSISTANCE
          </p>

          <p className="text-lg text-gray-600 leading-9">
            We encourage clients to contact our
            team before placing an order for
            sizing guidance. Our client services
            team can provide fit recommendations
            and measurement assistance to help
            ensure the correct size selection.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            GARMENT CONDITION
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Every garment is inspected before
            dispatch to ensure that it meets our
            quality standards and craftsmanship
            requirements.
          </p>
        </section>

      </div>

      {/* FOOTER */}

      <div className="mt-28 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
          CLIENT SERVICES
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
          Limited pieces.
          <br />
          Thoughtfully crafted.
          <br />
          Intentionally produced.
        </p>

        <p className="mt-12 text-gray-500">
          For sizing assistance or order enquiries,
          please contact
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
