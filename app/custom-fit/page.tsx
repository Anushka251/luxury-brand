export default function CustomFitPage() {
  return (
    <main className="max-w-5xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

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
        CUSTOM FIT
      </h1>

      <p className="max-w-3xl text-gray-600 leading-8 mb-20">
        Begin by selecting the standard size that most closely
        matches your measurements. Our Custom Fit service allows
        specific measurements to be refined while preserving the
        intended silhouette of the garment.
      </p>

      {/* PROCESS */}

      <div className="grid md:grid-cols-3 gap-12 border-y py-12 mb-20">

        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
            STEP 1
          </p>

          <h2 className="text-2xl font-light mb-3">
            Choose a Base Size
          </h2>

          <p className="text-gray-600 leading-8">
            Select the standard size that fits you best.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
            STEP 2
          </p>

          <h2 className="text-2xl font-light mb-3">
            Personalise Your Fit
          </h2>

          <p className="text-gray-600 leading-8">
            Adjust individual measurements to achieve your
            preferred fit.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
            STEP 3
          </p>

          <h2 className="text-2xl font-light mb-3">
            Reserve Your Slot
          </h2>

          <p className="text-gray-600 leading-8">
            Complete your booking and your measurements
            will be saved with your order.
          </p>
        </div>

      </div>

      {/* MEASUREMENTS */}

      <div className="space-y-10">

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            BASE SIZE
          </label>

          <select className="w-full border-b border-gray-300 bg-transparent py-4 outline-none">
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            BUST (cm)
          </label>

          <input
            type="number"
            placeholder="Enter measurement"
            className="w-full border-b border-gray-300 bg-transparent py-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            WAIST (cm)
          </label>

          <input
            type="number"
            placeholder="Enter measurement"
            className="w-full border-b border-gray-300 bg-transparent py-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            HIP (cm)
          </label>

          <input
            type="number"
            placeholder="Enter measurement"
            className="w-full border-b border-gray-300 bg-transparent py-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            HEIGHT (cm)
          </label>

          <input
            type="number"
            placeholder="Enter measurement"
            className="w-full border-b border-gray-300 bg-transparent py-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            HEEL HEIGHT (Optional)
          </label>

          <input
            type="text"
            placeholder="Example: 7 cm"
            className="w-full border-b border-gray-300 bg-transparent py-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
            ADDITIONAL NOTES
          </label>

          <textarea
            rows={5}
            placeholder="Share any additional fit preferences..."
            className="w-full border border-gray-300 p-4 outline-none resize-none"
          />
        </div>

      </div>

      {/* NOTE */}

      <div className="mt-20 border-t pt-12">

        <p className="text-xs tracking-[0.35em] text-gray-400 mb-6">
          IMPORTANT
        </p>

        <p className="text-gray-600 leading-8">
          Custom Fit requests are reviewed before production
          begins. Measurements submitted with your order will
          be used to personalise the garment while maintaining
          the intended design and proportions.
        </p>

      </div>

      {/* FOOTER */}

      <div className="mt-24 pt-16 border-t text-center">

        <p className="text-xs tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        <p className="mt-4 text-gray-500">
          Modern Couture. Silent Luxury. Crafted With Intention.
        </p>

      </div>

    </main>
  );
}
