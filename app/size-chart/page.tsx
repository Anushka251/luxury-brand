export default function SizeChartPage() {
  const sizes = [
    {
      size: "XS",
      bust: "32 in / 81 cm",
      waist: "24 in / 61 cm",
      hip: "34 in / 86 cm",
    },
    {
      size: "S",
      bust: "34 in / 86 cm",
      waist: "26 in / 66 cm",
      hip: "36 in / 91 cm",
    },
    {
      size: "M",
      bust: "36 in / 91 cm",
      waist: "28 in / 71 cm",
      hip: "38 in / 97 cm",
    },
    {
      size: "L",
      bust: "38 in / 97 cm",
      waist: "30 in / 76 cm",
      hip: "40 in / 102 cm",
    },
    {
      size: "XL",
      bust: "40 in / 102 cm",
      waist: "32 in / 81 cm",
      hip: "42 in / 107 cm",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* Header */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
        AVENOR CLIENT
      </p>

      <h1
        className="
          text-5xl
          md:text-7xl
          font-light
          tracking-[0.12em]
          mb-8
        "
      >
        SIZE CHART
      </h1>

      <p className="max-w-2xl text-gray-600 leading-8 mb-20">
        Our garments are designed with a refined silhouette.
        If you are between sizes, we recommend selecting the
        larger size for a more relaxed fit or contacting us
        for personalised sizing assistance.
      </p>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-y">

              <th className="py-6 text-left text-xs tracking-[0.3em] font-normal text-gray-400">
                SIZE
              </th>

              <th className="py-6 text-left text-xs tracking-[0.3em] font-normal text-gray-400">
                BUST
              </th>

              <th className="py-6 text-left text-xs tracking-[0.3em] font-normal text-gray-400">
                WAIST
              </th>

              <th className="py-6 text-left text-xs tracking-[0.3em] font-normal text-gray-400">
                HIP
              </th>

            </tr>

          </thead>

          <tbody>

            {sizes.map((item) => (
              <tr
                key={item.size}
                className="border-b"
              >
                <td className="py-8 text-xl font-light">
                  {item.size}
                </td>

                <td className="py-8 text-gray-600">
                  {item.bust}
                </td>

                <td className="py-8 text-gray-600">
                  {item.waist}
                </td>

                <td className="py-8 text-gray-600">
                  {item.hip}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Notes */}

      <div className="mt-20 border-t pt-12">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-8">
          FIT NOTES
        </p>

        <div className="space-y-6 text-gray-600 leading-8">

          <p>
            • Measurements are based on body measurements,
            not garment dimensions.
          </p>

          <p>
            • Due to handcrafted construction, slight
            variations may occur.
          </p>

          <p>
            • If you require personalised sizing
            assistance, please contact us before placing
            your order.
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-24 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        <p className="mt-4 text-gray-500">
          Quiet Luxury. Contemporary Fashion. Limited Drop.
        </p>

      </div>

    </main>
  );
}
