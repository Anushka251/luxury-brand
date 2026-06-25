export default function SupportPage() {
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
        SUPPORT
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
          Our client services team is available to
          assist with orders, sizing, product
          information, and after-purchase support.
        </p>
      </div>

      {/* INFORMATION */}

      <div className="space-y-20">

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            CONTACT
          </p>

          <div>
            <p className="text-lg text-gray-600 leading-9">
              For any inquiries regarding your
              order, sizing guidance, or product
              details, please contact us directly.
            </p>

            <a
              href="mailto:support@avenorcollection.com"
              className="
                inline-block
                mt-6
                text-black
                tracking-[0.2em]
                hover:opacity-60
                transition
              "
            >
              support@avenorcollection.com
            </a>
          </div>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            RESPONSE
          </p>

          <p className="text-lg text-gray-600 leading-9">
            We aim to respond to all inquiries
            within 24–48 hours.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            ORDERS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Please include your order number and
            relevant details when contacting us to
            ensure faster assistance.
          </p>
        </section>

      </div>

      {/* FOOTER MESSAGE */}

      <div className="mt-28 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
          AVENOR CLIENT SERVICES
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
          Thoughtful assistance,
          personal attention,
          and exceptional care.
        </p>

      </div>

    </main>
  );
}
