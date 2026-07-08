import Link from "next/link";

export default function ReservationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        <h1
          className="mt-6 text-5xl font-light text-[#AF9685]"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          Reservation Received
        </h1>

        <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
          Thank you for your interest in AVENOR.
          <br />
          <br />
          Your Studio Reservation has been successfully recorded.
          Prior to the public release, our atelier will carefully review
          all reservations and contact selected clients regarding
          allocation and next steps.
        </p>

        <p className="mt-8 text-sm leading-7 text-gray-500">
          Please note that submitting a reservation does not guarantee
          allocation. Studio reservations close 48 hours before the
          collection launches publicly. Once reservations close, pieces
          become available to all clients and may sell out.
        </p>

        <div className="mt-12">
          <Link
            href="/shop"
            className="
              inline-block
              border
              border-[#AF9685]
              px-12
              py-4
              text-xs
              uppercase
              tracking-[0.35em]
              text-[#AF9685]
              transition-all
              duration-300
              hover:bg-[#AF9685]
              hover:text-white
            "
          >
            Return to Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
