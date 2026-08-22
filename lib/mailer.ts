import nodemailer from "nodemailer";
import { products } from "@/lib/products";

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
                  ).toLocaleString()}
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

    subject: `Avenor Order Confirmation • ${orderNumber}`,

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
                          ₹${total.toLocaleString()}
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

export async function sendReservationConfirmationEmail({
  customerEmail,
  customerName,
  product,
  orderId,
  reservationFee,
}: ReservationEmailProps) {

  /*
   * Find the exact product from lib/products.ts
   */
  const reservedProduct = products.find(
    (item) => item.id === product
  );

  /*
   * Product name
   */
  const productName =
    reservedProduct?.name ??
    "Selected Piece";

  /*
   * Exact cover image from products.ts
   */
  const rawCoverImage =
    reservedProduct?.coverImage ?? "";

  /*
   * Convert the Next.js public path
   * into a complete HTTPS URL.
   */
  const coverImageUrl =
    rawCoverImage.startsWith("http")
      ? rawCoverImage
      : `https://avenorcollection.com${rawCoverImage}`;

  /*
   * Product page
   */
  const productUrl =
    `https://avenorcollection.com/reserve/${product}`;

  console.log(
    "Reservation email product:",
    productName
  );

  console.log(
    "Reservation email image:",
    coverImageUrl
  );

  await transporter.sendMail({
    from: `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,

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
            width:100%;
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

                <!-- AVENOR -->

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
                      margin:14px 0 0;
                      font-size:10px;
                      letter-spacing:3px;
                      color:#999999;
                    ">
                      AVENOR COLLECTION
                    </p>

                  </td>
                </tr>


                <!-- HEADER -->

                <tr>
                  <td
                    align="center"
                    style="padding-top:45px;"
                  >

                    <p style="
                      margin:0;
                      font-size:11px;
                      letter-spacing:3px;
                      color:#AF9685;
                    ">
                      STUDIO RESERVATION
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


                <!-- RESERVED PIECE -->

                <tr>
                  <td
                    align="center"
                    style="padding-top:40px;"
                  >

                    <p style="
                      margin:0;
                      font-size:10px;
                      letter-spacing:3px;
                      color:#AF9685;
                    ">
                      RESERVED PIECE
                    </p>

                    <h2 style="
                      margin:14px 0 25px;
                      font-family:Georgia,serif;
                      font-size:28px;
                      line-height:1.2;
                      font-weight:400;
                      color:#111111;
                    ">
                      ${productName}
                    </h2>

                    <!-- COVER IMAGE -->

                    <a
                      href="${productUrl}"
                      target="_blank"
                      style="
                        text-decoration:none;
                      "
                    >

                      <img
                        src="${coverImageUrl}"
                        alt="${productName}"
                        width="320"
                        style="
                          display:block;
                          width:320px;
                          max-width:100%;
                          height:auto;
                          margin:0 auto;
                          border:1px solid #ded6cf;
                        "
                      />

                    </a>

                    <p style="
                      margin:14px 0 0;
                      font-size:11px;
                      letter-spacing:2px;
                      color:#999999;
                    ">
                      ${reservedProduct?.type ?? ""}
                    </p>

                  </td>
                </tr>


                <!-- PAYMENT -->

                <tr>
                  <td style="padding-top:35px;">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                    >

                      <tr>

                        <td style="
                          padding:12px 0;
                          color:#666666;
                          font-size:14px;
                        ">
                          Reservation Fee
                        </td>

                        <td
                          align="right"
                          style="
                            padding:12px 0;
                            color:#111111;
                            font-size:16px;
                            font-weight:500;
                          "
                        >
                          ₹${reservationFee.toLocaleString()}
                        </td>

                      </tr>

                      <tr>

                        <td style="
                          padding:12px 0;
                          border-top:1px solid #eeeeee;
                          color:#666666;
                          font-size:14px;
                        ">
                          Payment Status
                        </td>

                        <td
                          align="right"
                          style="
                            padding:12px 0;
                            border-top:1px solid #eeeeee;
                            color:#8C9A78;
                            font-size:14px;
                            font-weight:500;
                          "
                        >
                          PAID
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>


                <!-- RESERVATION INFORMATION -->

                <tr>
                  <td
                    style="
                      padding-top:35px;
                      color:#555555;
                      font-size:14px;
                      line-height:1.9;
                    "
                  >

                    Your reservation gives you
                    priority access to the AVENOR
                    studio consultation for
                    <strong>${productName}</strong>
                    before the public release.

                    <br /><br />

                    Our atelier will contact you using
                    the details provided during your
                    reservation.

                    <br /><br />

                    Please note that your reservation
                    does not guarantee garment
                    allocation or purchase. All AVENOR
                    pieces remain limited and subject
                    to availability.

                  </td>
                </tr>


                <!-- REFERENCE -->

                <tr>
                  <td style="padding-top:35px;">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        border-top:1px solid #eeeeee;
                      "
                    >

                      <tr>

                        <td style="
                          padding-top:25px;
                          color:#999999;
                          font-size:11px;
                          letter-spacing:1px;
                        ">
                          RESERVATION REFERENCE
                        </td>

                      </tr>

                      <tr>

                        <td style="
                          padding-top:8px;
                          color:#555555;
                          font-size:12px;
                          word-break:break-all;
                        ">
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

                    If you have any questions,
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
