import nodemailer from "nodemailer";
import path from "path";
import { products } from "@/lib/products";

/*
 * =========================================================
 * ZOHO MAIL TRANSPORTER
 * =========================================================
 */

export const transporter =
  nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,

    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

/*
 * =========================================================
 * NORMAL ORDER EMAIL
 * =========================================================
 */

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
      const imageUrl =
        item.image?.startsWith("http")
          ? item.image
          : `https://avenorcollection.com${item.image}`;

      const productUrl = item.slug
        ? `https://avenorcollection.com/product/${item.slug}`
        : "https://avenorcollection.com/shop";

      return `
        <tr>
          <td style="
            padding:16px 0;
            border-bottom:1px solid #e5e5e5;
          ">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >

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
                      color:#111111;
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
                          color:#666666;
                          font-size:13px;
                        ">
                          Size: ${item.size}
                        </p>
                      `
                      : ""
                  }

                  <p style="
                    margin:6px 0 0;
                    color:#666666;
                    font-size:13px;
                  ">
                    Qty: ${item.quantity}
                  </p>

                </td>

                <td
                  valign="top"
                  align="right"
                  style="
                    color:#111111;
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
    from:
      `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,

    replyTo:
      "support@avenorcollection.com",

    to:
      customerEmail,

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
          border="0"
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
                border="0"
                style="
                  width:100%;
                  max-width:600px;
                  background:#ffffff;
                  padding:50px 40px;
                "
              >

                <!-- LOGO -->

                <tr>
                  <td align="center">

                    <p style="
                      margin:0;
                      font-size:32px;
                      line-height:1;
                      letter-spacing:10px;
                      color:#111111;
                      font-weight:300;
                    ">
                      AVENOR
                    </p>

                  </td>
                </tr>

                <!-- HEADER -->

                <tr>
                  <td style="
                    padding-top:40px;
                  ">

                    <p style="
                      margin:0;
                      color:#666666;
                      font-size:12px;
                      line-height:1.5;
                      letter-spacing:2px;
                    ">
                      ORDER CONFIRMED
                    </p>

                    <h1 style="
                      margin:12px 0 0;
                      color:#111111;
                      font-size:30px;
                      line-height:1.25;
                      font-weight:400;
                    ">
                      Thank you for your order.
                    </h1>

                    <p style="
                      margin:20px 0 0;
                      color:#555555;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Dear ${customerName},
                      your order has been received
                      and is now being prepared
                      with care.
                    </p>

                  </td>
                </tr>

                <!-- ORDER NUMBER -->

                <tr>
                  <td style="
                    padding:30px;
                    margin-top:30px;
                    border:1px solid #e5e5e5;
                  ">

                    <p style="
                      margin:0;
                      color:#888888;
                      font-size:12px;
                      line-height:1.5;
                      letter-spacing:1px;
                    ">
                      ORDER NUMBER
                    </p>

                    <p style="
                      margin:8px 0 0;
                      font-size:18px;
                      line-height:1.5;
                      color:#111111;
                    ">
                      ${orderNumber}
                    </p>

                  </td>
                </tr>

                <!-- ITEMS -->

                <tr>
                  <td style="
                    padding-top:40px;
                  ">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      ${itemsHtml}
                    </table>

                  </td>
                </tr>

                <!-- TOTAL -->

                <tr>
                  <td style="
                    padding-top:30px;
                    border-top:1px solid #e5e5e5;
                  ">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td style="
                          color:#666666;
                          font-size:15px;
                        ">
                          Total Paid
                        </td>

                        <td
                          align="right"
                          style="
                            color:#111111;
                            font-size:22px;
                            font-weight:500;
                          "
                        >
                          ₹${total.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

                <!-- BUTTON -->

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:40px;
                    "
                  >

                    <a
                      href="https://avenorcollection.com/account/orders"
                      target="_blank"
                      style="
                        display:inline-block;
                        background:#111111;
                        color:#ffffff;
                        text-decoration:none;
                        padding:16px 40px;
                        font-size:13px;
                        line-height:1.5;
                        letter-spacing:2px;
                      "
                    >
                      VIEW YOUR ORDER
                    </a>

                  </td>
                </tr>

                <!-- SUPPORT -->

                <tr>
                  <td style="
                    padding-top:40px;
                    color:#666666;
                    font-size:14px;
                    line-height:1.8;
                  ">

                    We will notify you again once
                    your order has been shipped.

                    <br /><br />

                    If you have any questions,
                    simply reply to this email or
                    contact us at

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
                      color:#999999;
                      letter-spacing:4px;
                    ">
                      AVENOR
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999999;
                      font-size:12px;
                    ">
                      Luxury crafted for everyday elegance.
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999999;
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

/*
 * =========================================================
 * AVENOR STUDIO RESERVATION EMAIL
 * =========================================================
 */

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
   * =======================================================
   * FIND PRODUCT
   * =======================================================
   */

  const productData = products.find(
    (p) => p.id === product
  );

  if (!productData) {
    throw new Error(
      `Product not found for reservation: ${product}`
    );
  }

  const productName =
    productData.name;

  /*
   * =======================================================
   * LOCAL COVER IMAGE
   * =======================================================
   */

  const coverImagePath =
    path.join(
      process.cwd(),
      "public",
      productData.coverImage
    );

  /*
   * =======================================================
   * RESERVATION PAGE
   * =======================================================
   *
   * For Crimson Rose:
   *
   * https://avenorcollection.com/reserve/crimson-rose
   *
   * =======================================================
   */

  const reservationUrl =
    "https://avenorcollection.com/reserve/crimson-rose";

  /*
   * =======================================================
   * PRIVATE ACCESS PAGE
   * =======================================================
   *
   * The main button goes here.
   *
   * =======================================================
   */

  const privateAccessUrl =
    "https://avenorcollection.com/account/private-access";

  /*
   * =======================================================
   * UNIQUE IMAGE CID
   * =======================================================
   */

  const imageCid =
    `avenor-${product}-${orderId}@avenorcollection.com`;

  /*
   * =======================================================
   * SEND EMAIL
   * =======================================================
   */

  await transporter.sendMail({
    from:
      `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,

    replyTo:
      "support@avenorcollection.com",

    to:
      customerEmail,

    subject:
      `AVENOR Studio Reservation Confirmed • ${productName}`,

    /*
     * EMBED PRODUCT IMAGE
     */

    attachments: [
      {
        filename:
          `${product}-cover.jpg`,

        path:
          coverImagePath,

        cid:
          imageCid,

        contentType:
          "image/jpeg",
      },
    ],

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
          border="0"
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
                border="0"
                style="
                  width:100%;
                  max-width:600px;
                  background:#ffffff;
                  padding:50px 40px;
                "
              >

                <!-- =================================================
                     AVENOR LOGO
                ================================================== -->

                <tr>
                  <td align="center">

                    <p style="
                      margin:0;
                      font-size:32px;
                      line-height:1;
                      letter-spacing:10px;
                      color:#111111;
                      font-weight:300;
                    ">
                      AVENOR
                    </p>

                  </td>
                </tr>

                <!-- =================================================
                     HEADER
                ================================================== -->

                <tr>
                  <td style="
                    padding-top:40px;
                  ">

                    <p style="
                      margin:0;
                      color:#AF9685;
                      font-size:12px;
                      line-height:1.5;
                      letter-spacing:2px;
                    ">
                      AVENOR STUDIO RESERVATION
                    </p>

                    <h1 style="
                      margin:12px 0 0;
                      color:#111111;
                      font-family:Georgia,serif;
                      font-size:30px;
                      line-height:1.25;
                      font-weight:400;
                    ">
                      Private Access Confirmed
                    </h1>

                    <p style="
                      margin:20px 0 0;
                      color:#555555;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Dear ${customerName},
                      your AVENOR private studio
                      access has been successfully
                      confirmed.
                    </p>

                  </td>
                </tr>

                <!-- =================================================
                     PRODUCT IMAGE
                     CLICKING IMAGE → RESERVATION PAGE
                ================================================== -->

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:35px;
                    "
                  >

                    <a
                      href="${reservationUrl}"
                      target="_blank"
                      style="
                        display:block;
                        text-decoration:none;
                      "
                    >

                      <img
                        src="cid:${imageCid}"
                        alt="${productName} — AVENOR"
                        width="300"
                        style="
                          display:block;
                          width:300px;
                          max-width:100%;
                          height:auto;
                          margin:0 auto;
                          border:0;
                          outline:none;
                          text-decoration:none;
                        "
                      />

                    </a>

                  </td>
                </tr>

                <!-- =================================================
                     PRODUCT NAME
                ================================================== -->

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:24px;
                    "
                  >

                    <p style="
                      margin:0;
                      color:#999999;
                      font-size:11px;
                      line-height:1.5;
                      letter-spacing:2px;
                    ">
                      PRIVATE ACCESS FOR
                    </p>

                    <p style="
                      margin:10px 0 0;
                      color:#111111;
                      font-family:Georgia,serif;
                      font-size:27px;
                      line-height:1.3;
                      font-weight:400;
                    ">
                      ${productName}
                    </p>

                    <!-- VIEW PIECE → RESERVATION PAGE -->

                    <a
                      href="${reservationUrl}"
                      target="_blank"
                      style="
                        display:inline-block;
                        margin-top:15px;
                        color:#AF9685;
                        text-decoration:none;
                        font-size:12px;
                        line-height:1.5;
                        letter-spacing:2px;
                      "
                    >
                      VIEW PIECE →
                    </a>

                  </td>
                </tr>

                <!-- =================================================
                     PAYMENT
                ================================================== -->

                <tr>
                  <td style="
                    padding-top:35px;
                    border-top:1px solid #e5e5e5;
                  ">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td style="
                          color:#666666;
                          font-size:14px;
                          line-height:1.5;
                        ">
                          Reservation Fee
                        </td>

                        <td
                          align="right"
                          style="
                            color:#111111;
                            font-size:18px;
                            line-height:1.5;
                            font-weight:500;
                          "
                        >
                          ₹${Number(
                            reservationFee
                          ).toLocaleString("en-IN")}
                        </td>

                      </tr>

                      <tr>

                        <td style="
                          padding-top:15px;
                          color:#666666;
                          font-size:14px;
                          line-height:1.5;
                        ">
                          Payment Status
                        </td>

                        <td
                          align="right"
                          style="
                            padding-top:15px;
                            color:#8C9A78;
                            font-size:13px;
                            line-height:1.5;
                            font-weight:500;
                            letter-spacing:1px;
                          "
                        >
                          PAID
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

                <!-- =================================================
                     RESERVATION MESSAGE
                ================================================== -->

                <tr>
                  <td style="
                    padding-top:35px;
                    color:#555555;
                    font-size:14px;
                    line-height:1.8;
                  ">

                    Your private access to
                    <strong>${productName}</strong>
                    has been recorded with AVENOR
                    before the public release.

                    <br /><br />

                    Our atelier will contact you using
                    the details provided during your
                    reservation.

                    <br /><br />

                    Your reservation provides priority
                    access to this piece but does not
                    itself guarantee final garment
                    allocation.

                    <br /><br />

                    If the reserved piece becomes
                    unavailable after your reservation,
                    AVENOR will contact you directly
                    regarding the applicable
                    compensation.

                  </td>
                </tr>

                <!-- =================================================
                     RESERVATION REFERENCE
                ================================================== -->

                <tr>
                  <td style="
                    padding-top:35px;
                  ">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        border-top:1px solid #eeeeee;
                      "
                    >

                      <tr>

                        <td style="
                          padding-top:25px;
                          color:#999999;
                          font-size:11px;
                          line-height:1.5;
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
                          line-height:1.5;
                          word-break:break-all;
                        ">
                          ${orderId}
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

                <!-- =================================================
                     VIEW CRIMSON ROSE BUTTON
                     → PRIVATE ACCESS PAGE
                ================================================== -->

                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:40px;
                    "
                  >

                    <a
                      href="${privateAccessUrl}"
                      target="_blank"
                      style="
                        display:inline-block;
                        background:#111111;
                        color:#ffffff;
                        text-decoration:none;
                        padding:16px 40px;
                        font-size:13px;
                        line-height:1.5;
                        letter-spacing:2px;
                      "
                    >
                      VIEW ${productName.toUpperCase()}
                    </a>

                  </td>
                </tr>

                <!-- =================================================
                     SUPPORT
                ================================================== -->

                <tr>
                  <td style="
                    padding-top:40px;
                    color:#666666;
                    font-size:14px;
                    line-height:1.8;
                  ">

                    If you have any questions,
                    simply reply to this email or
                    contact us at

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

                <!-- =================================================
                     FOOTER
                ================================================== -->

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
                      line-height:1.5;
                      color:#999999;
                      letter-spacing:4px;
                    ">
                      AVENOR
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999999;
                      font-size:12px;
                      line-height:1.5;
                    ">
                      Quiet luxury. Limited pieces.
                      Thoughtfully crafted.
                    </p>

                    <p style="
                      margin:12px 0 0;
                      color:#999999;
                      font-size:12px;
                      line-height:1.5;
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
