export default function ShippingPage() {
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
        SHIPPING
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
          Every Avenor piece is prepared with
          intention, crafted in limited quantities,
          and delivered with exceptional care.
        </p>
      </div>

      {/* SECTIONS */}

      <div className="space-y-20">

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PRODUCTION
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Every Avenor piece is crafted in limited
            quantities and prepared with care. As
            many garments are made to order,
            production begins once an order has
            been successfully placed.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            PROCESSING
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Orders are typically processed and
            dispatched within 7–14 business days.
            During collection launches or periods
            of increased demand, processing times
            may be slightly extended.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            TRACKING
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Once your order has been shipped,
            you will receive a confirmation email
            containing tracking information so
            that you may follow your package
            throughout its journey.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            DELIVERY
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Delivery times vary depending on
            destination, courier services,
            customs procedures, and local
            conditions. While we strive to meet
            estimated timelines, Avenor cannot
            be responsible for delays caused by
            circumstances beyond our control.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            ADDRESS
          </p>

          <p className="text-lg text-gray-600 leading-9">
            Customers are responsible for ensuring
            that shipping information provided at
            checkout is accurate and complete.
            Avenor cannot be held responsible for
            delays or failed deliveries resulting
            from incorrect address details.
          </p>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr] gap-12">
          <p className="text-xs tracking-[0.3em] text-gray-400">
            INTERNATIONAL
          </p>

          <p className="text-lg text-gray-600 leading-9">
            International orders may be subject to
            customs duties, taxes, or import
            charges imposed by the destination
            country. Such charges, where
            applicable, remain the responsibility
            of the customer.
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
          Thoughtfully prepared.
          <br />
          Carefully delivered.
        </p>

        <p className="mt-12 text-gray-500">
          For shipping-related enquiries, please contact
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
