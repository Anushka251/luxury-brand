import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

/* =========================================================
   NORMAL ORDER EMAIL
========================================================= */

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  slug?: string;
}

interface OrderEmailProps {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
}

export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderNumber,
  items,
  total,
}: OrderEmailProps) {
  const itemsHtml = items
    .map((item) => {
      const imageUrl = item.image?.startsWith("http")
        ? item.image
        : `https://avenorcollection.com${item.image}`;

      const productUrl = item.slug
        ? `https://avenorcollection.com/product/${item.slug}`
        : "https://avenorcollection.com/shop";

      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>

                <td width="90" valign="top">
                  <a
                    href="${productUrl}"
                    target="_blank"
                    style="text-decoration:none;"
                  >
                    <img
                      src="${imageUrl}"
                      alt="${item.name}"
                      width="80"
                      style="
                        display:block;
                        width:80px;
                        height:110px;
                        object-fit:cover;
                        border-radius:4px;
                        border:1px solid #eeeeee;
                      "
                    />
                  </a>
                </td>

                <td
                  valign="top"
                  style="padding-left:16px;"
                >
                  <a
                    href="${productUrl}"
                    target="_blank"
                    style="
                      text-decoration:none;
                      color:#111111;
                    "
                  >
                    <p style="
                      margin:0;
                      font-size:14px;
                      color:#111;
                      font-weight:500;
                    ">
                      ${item.name}
                    </p>
                  </a>

                  ${
                    item.size
                      ? `
                        <p style="
                          margin:6px 0 0;
                          color:#666;
                          font-size:13px;
                        ">
                          Size: ${item.size}
                        </p>
                      `
                      : ""
                  }

                  <p style="
                    margin:6px 0 0;
                    color:#666;
                    font-size:13px;
                  ">
                    Qty: ${item.quantity}
                  </p>
                </td>

                <td
                  valign="top"
                  align="right"
                  style="
                    color:#111;
                    font-size:14px;
                    font-weight:500;
                    white-space:nowrap;
                  "
                >
                  ₹${(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </td>

              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  await transporter.sendMail({
    from: `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,
    to: customerEmail,

    subject:
      `Avenor Order Confirmation • ${orderNumber}`,

    html: `
      <div style="
        margin:0;
        padding:0;
        background:#f7f7f5;
      ">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#f7f7f5;
            padding:40px 20px;
            font-family:Helvetica,Arial,sans-serif;
          "
        >

          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width:600px;
                  background:#ffffff;
                  padding:50px 40px;
                "
              >

                <tr>
                  <td align="center">

                    <p style="
                      margin:0;
                      font-size:32px;
                      letter-spacing:10px;
                      color:#111111;
                      font-weight:300;
                    ">
                      AVENOR
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;">

                    <p style="
                      margin:0;
                      color:#666;
                      font-size:12px;
                      letter-spacing:2px;
                    ">
                      ORDER CONFIRMED
                    </p>

                    <h1 style="
                      margin:12px 0 0;
                      color:#111;
                      font-size:30px;
                      font-weight:400;
                    ">
                      Thank you for your order.
                    </h1>

                    <p style="
                      margin:20px 0 0;
                      color:#555;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Dear ${customerName},
                      your order has been received and is
                      now being prepared with care.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:30px;
                    margin-top:30px;
                    border:1px solid #e5e5e5;
                  ">

                    <p style="
                      margin:0;
                      color:#888;
                      font-size:12px;
                      letter-spacing:1px;
                    ">
                      ORDER NUMBER
                    </p>

                    <p style="
                      margin:8px 0 0;
                      font-size:18px;
                      color:#111;
                    ">
                      ${orderNumber}
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;">

                    <table width="100%">
                      ${itemsHtml}
                    </table>

                  </td>
                </tr>

                <tr>
                  <td style="
                    padding-top:30px;
                    border-top:1px solid #e5e5e5;
                  ">

                    <table width="100%">

                      <tr>

                        <td style="
                          color:#666;
                          font-size:15px;
                        ">
                          Total Paid
                        </td>

                        <td
                          align="right"
                          style="
                            color:#111;
                            font-size:22px;
                            font-weight:500;
                          "
                        >
                          ₹${total.toLocaleString("en-IN")}
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="padding-top:40px;"
                  >

                    <a
                      href="https://avenorcollection.com/account/orders"
                      style="
                        display:inline-block;
                        background:#111111;
                        color:#ffffff;
                        text-decoration:none;
                        padding:16px 40px;
                        font-size:13px;
                        letter-spacing:2px;
                      "
                    >
                      VIEW YOUR ORDER
                    </a>

                  </td>
                </tr>

                <tr>
                  <td style="
                    padding-top:40px;
                    color:#666;
                    font-size:14px;
                    line-height:1.8;
                  ">

                    We will notify you again once your
                    order has been shipped.

                    <br /><br />

                    If you have any questions, simply
                    reply to this email or contact us at

                    <a
                      href="mailto:support@avenorcollection.com"
                      style="
                        color:#111;
                        text-decoration:none;
                      "
                    >
                      support@avenorcollection.com
                    </a>.

                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:50px;
                      border-top:1px solid #eeeeee;
                    "
                  >

                    <p style="
                      margin:0;
                      font-size:12px;
                      color:#999;
                      letter-spacing:4px;
                    ">
                      AVENOR
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999;
                      font-size:12px;
                    ">
                      Luxury crafted for everyday elegance.
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999;
                      font-size:12px;
                    ">
                      © ${new Date().getFullYear()}
                      Avenor Collection
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>

      </div>
    `,
  });
}


/* =========================================================
   AVENOR STUDIO RESERVATION EMAIL
========================================================= */

interface ReservationEmailProps {
  customerEmail: string;
  customerName: string;
  product: string;
  orderId: string;
  reservationFee: number;
}


/*
 * Convert product ID into the actual
 * AVENOR product name.
 */
function getReservationProductName(
  product: string
) {
  switch (product) {
    case "crimson-rose":
      return "Crimson Rose";

    case "ivory-blush":
      return "Ivory Blush";

    case "blue-crystal":
      return "Blue Crystal";

    case "sunset-lilac":
      return "Sunset Lilac";

    default:
      return "Selected Piece";
  }
}


/*
 * IMPORTANT:
 *
 * These paths must match the coverImage
 * values in your products file.
 *
 * If your actual coverImage paths are
 * different, replace them here.
 */
function getReservationCoverImage(
  product: string
) {
  switch (product) {
    case "crimson-rose":
      return "/images/crimson-rose/cover.jpg";

    case "ivory-blush":
      return "/images/ivory-blush/cover.jpg";

    case "blue-crystal":
      return "/images/blue-crystal/cover.JPG";

    case "sunset-lilac":
      return "/images/sunset-lilac/cover.jpg";

    default:
      return "";
  }
}


export async function sendReservationConfirmationEmail({
  customerEmail,
  customerName,
  product,
  orderId,
  reservationFee,
}: ReservationEmailProps) {
  const productName =
    getReservationProductName(
      product
    );

  const coverImage =
    getReservationCoverImage(
      product
    );

  const coverImageUrl =
    coverImage
      ? coverImage.startsWith("http")
        ? coverImage
        : `https://avenorcollection.com${coverImage}`
      : "";

  await transporter.sendMail({
    from:
      `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,

    to: customerEmail,

    subject:
      `AVENOR Studio Reservation Confirmed • ${productName}`,

    html: `
      <div style="
        margin:0;
        padding:0;
        background:#f7f5f2;
      ">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#f7f5f2;
            padding:40px 20px;
            font-family:Helvetica,Arial,sans-serif;
          "
        >

          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  width:100%;
                  max-width:600px;
                  background:#ffffff;
                  padding:55px 45px;
                "
              >

                <!-- LOGO -->

                <tr>
                  <td align="center">

                    <p style="
                      margin:0;
                      font-size:32px;
                      letter-spacing:10px;
                      color:#111111;
                      font-weight:300;
                    ">
                      AVENOR
                    </p>

                    <p style="
                      margin:12px 0 0;
                      font-size:10px;
                      letter-spacing:4px;
                      color:#999999;
                    ">
                      COLLECTION
                    </p>

                  </td>
                </tr>


                <!-- HEADER -->

                <tr>
                  <td
                    align="center"
                    style="padding-top:50px;"
                  >

                    <p style="
                      margin:0;
                      font-size:11px;
                      letter-spacing:3px;
                      color:#AF9685;
                    ">
                      AVENOR STUDIO RESERVATION
                    </p>

                    <h1 style="
                      margin:16px 0 0;
                      font-family:Georgia,serif;
                      font-size:34px;
                      line-height:1.2;
                      font-weight:400;
                      color:#111111;
                    ">
                      Reservation Confirmed
                    </h1>

                    <p style="
                      margin:22px 0 0;
                      color:#666666;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Dear ${customerName},
                    </p>

                    <p style="
                      margin:10px 0 0;
                      color:#666666;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Your AVENOR studio reservation
                      has been successfully confirmed.
                    </p>

                  </td>
                </tr>


                <!-- PIECE -->

                <tr>
                  <td
                    align="center"
                    style="padding-top:45px;"
                  >

                    <p style="
                      margin:0 0 18px;
                      font-size:10px;
                      letter-spacing:3px;
                      color:#999999;
                    ">
                      RESERVED FOR
                    </p>

                    ${
                      coverImageUrl
                        ? `
                          <img
                            src="${coverImageUrl}"
                            alt="${productName} — AVENOR Collection"
                            width="360"
                            style="
                              display:block;
                              width:360px;
                              max-width:100%;
                              height:auto;
                              margin:0 auto;
                              border:1px solid #eeeeee;
                            "
                          />
                        `
                        : ""
                    }

                    <h2 style="
                      margin:25px 0 0;
                      font-family:Georgia,serif;
                      font-size:30px;
                      line-height:1.2;
                      font-weight:400;
                      color:#AF9685;
                    ">
                      ${productName}
                    </h2>

                    <p style="
                      margin:10px 0 0;
                      color:#999999;
                      font-size:10px;
                      letter-spacing:3px;
                    ">
                      AVENOR COLLECTION
                    </p>

                  </td>
                </tr>


                <!-- PAYMENT -->

                <tr>
                  <td
                    style="
                      padding-top:40px;
                    "
                  >

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        border-top:1px solid #eeeeee;
                        border-bottom:1px solid #eeeeee;
                      "
                    >

                      <tr>

                        <td style="
                          padding:18px 0;
                          color:#666666;
                          font-size:14px;
                        ">
                          Studio Reservation Fee
                        </td>

                        <td
                          align="right"
                          style="
                            padding:18px 0;
                            color:#111111;
                            font-size:17px;
                            font-weight:500;
                          "
                        >
                          ₹${reservationFee.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                      </tr>


                      <tr>

                        <td style="
                          padding:18px 0;
                          border-top:1px solid #eeeeee;
                          color:#666666;
                          font-size:14px;
                        ">
                          Payment Status
                        </td>

                        <td
                          align="right"
                          style="
                            padding:18px 0;
                            border-top:1px solid #eeeeee;
                            color:#75865F;
                            font-size:13px;
                            font-weight:600;
                            letter-spacing:1px;
                          "
                        >
                          PAID
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>


                <!-- CONFIRMATION -->

                <tr>
                  <td
                    style="
                      padding-top:38px;
                      color:#555555;
                      font-size:14px;
                      line-height:1.9;
                    "
                  >

                    <p style="margin:0;">
                      This payment confirms your
                      <strong>AVENOR Studio Reservation</strong>
                      for
                      <strong>${productName}</strong>.
                    </p>

                    <p style="margin:18px 0 0;">
                      Your studio opportunity was opened
                      to you before the public release,
                      providing you with priority access
                      to the collection.
                    </p>

                    <p style="margin:18px 0 0;">
                      Our atelier will contact you using
                      the details provided during your
                      reservation.
                    </p>

                  </td>
                </tr>


                <!-- IMPORTANT TERMS -->

                <tr>
                  <td
                    style="
                      margin-top:30px;
                      padding-top:30px;
                      color:#666666;
                      font-size:13px;
                      line-height:1.9;
                    "
                  >

                    <p style="
                      margin:0;
                      color:#AF9685;
                      font-size:10px;
                      letter-spacing:2px;
                    ">
                      RESERVATION TERMS
                    </p>

                    <p style="margin:14px 0 0;">
                      The reservation fee is
                      <strong>
                        non-refundable and
                        non-compensatory
                      </strong>.
                    </p>

                    <p style="margin:14px 0 0;">
                      If you miss your reserved studio
                      opportunity, the reservation fee is
                      forfeited and cannot be refunded,
                      transferred, or compensated.
                    </p>

                    <p style="margin:14px 0 0;">
                      Your reservation does not guarantee
                      garment allocation or purchase.
                      All AVENOR pieces remain limited
                      and subject to availability.
                    </p>

                  </td>
                </tr>


                <!-- REFERENCE -->

                <tr>
                  <td
                    style="
                      padding-top:38px;
                    "
                  >

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        border-top:1px solid #eeeeee;
                      "
                    >

                      <tr>

                        <td
                          style="
                            padding-top:25px;
                            color:#999999;
                            font-size:10px;
                            letter-spacing:2px;
                          "
                        >
                          RESERVATION REFERENCE
                        </td>

                      </tr>

                      <tr>

                        <td
                          style="
                            padding-top:9px;
                            color:#555555;
                            font-size:12px;
                            word-break:break-all;
                          "
                        >
                          ${orderId}
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>


                <!-- SUPPORT -->

                <tr>
                  <td
                    style="
                      padding-top:40px;
                      color:#777777;
                      font-size:13px;
                      line-height:1.8;
                    "
                  >

                    If you have any questions, simply
                    reply to this email or contact us at

                    <a
                      href="mailto:support@avenorcollection.com"
                      style="
                        color:#111111;
                        text-decoration:none;
                      "
                    >
                      support@avenorcollection.com
                    </a>.

                  </td>
                </tr>


                <!-- FOOTER -->

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:50px;
                      border-top:1px solid #eeeeee;
                    "
                  >

                    <p style="
                      margin:0;
                      font-size:12px;
                      letter-spacing:4px;
                      color:#999999;
                    ">
                      AVENOR
                    </p>

                    <p style="
                      margin:12px 0 0;
                      font-size:12px;
                      color:#999999;
                    ">
                      Quiet luxury. Limited pieces.
                      Thoughtfully crafted.
                    </p>

                    <p style="
                      margin:12px 0 0;
                      font-size:12px;
                      color:#999999;
                    ">
                      © ${new Date().getFullYear()}
                      Avenor Collection
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>

      </div>
    `,
  });
}
