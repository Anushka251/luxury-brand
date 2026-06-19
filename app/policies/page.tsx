export default function PoliciesPage() {
  return (
    <div className="px-12 py-28 max-w-3xl mx-auto text-sm leading-8 text-gray-700">
      <h1 className="text-3xl tracking-[0.2em] mb-12 font-light">
        POLICIES
      </h1>

      <p className="mb-6">
        All Avenor pieces are crafted in limited quantities and produced
        on a made-to-order basis. Each garment is carefully prepared
        in-house with attention to detail, construction, and finish.
      </p>

      <p className="mb-6">
        Orders are processed only after full payment has been received.
        We currently do not offer Cash on Delivery (COD) as all pieces
        are produced specifically for each order.
      </p>

      <p className="mb-6">
        Production and dispatch generally take 7–14 business days.
        Once your order has been shipped, tracking information will be
        provided via email.
      </p>

      <p className="mb-6">
        Due to differences in lighting conditions, photography, screen
        calibration, and device displays, colours may appear slightly
        different from the final product. Such variations are considered
        a natural characteristic of the materials and craftsmanship used.
      </p>

      <p className="mb-6">
        Customer information including name, email address, phone number,
        and shipping details is collected solely for the purpose of
        processing orders, providing support, and improving the customer
        experience. Avenor does not sell or share customer information
        with third parties except where necessary to fulfil orders or
        comply with legal obligations.
      </p>

      <p className="mb-6">
        Product availability, pricing, and specifications may be updated
        without prior notice. Avenor reserves the right to refuse or
        cancel orders in cases of pricing errors, suspected fraudulent
        activity, or circumstances beyond our reasonable control.
      </p>

      <p className="mb-6">
        By accessing this website and placing an order, you acknowledge
        and agree to the policies outlined above.
      </p>

      <p>
        For any questions regarding your order, shipping, or policies,
        please contact us at{" "}
        <a
          href="mailto:support@avenorcollection.com"
          className="underline"
        >
          support@avenorcollection.com
        </a>.
      </p>
    </div>
  );
}
