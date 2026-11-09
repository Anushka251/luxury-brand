
import nodemailer from "nodemailer";
import path from "path";
import { products } from "@/lib/products";

/*
=========================================================
ZOHO MAIL TRANSPORTER
=========================================================
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
=========================================================
NORMAL ORDER EMAIL
=========================================================
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
          <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="90" valign="top">
                  <a href="${productUrl}" target="_blank" style="text-decoration:none;">
                    <img
                      src="${imageUrl}"
                      alt="${item.name}"
                      width="80"
                      style="display:block;width:80px;height:110px;object-fit:cover;border-radius:4px;border:1px solid #eeeeee;"
                    />
                  </a>
                </td>

                <td valign="top" style="padding-left:16px;">
                  <a href="${productUrl}" target="_blank" style="text-decoration:none;color:#111111;">
                    <p style="margin:0;font-size:14px;color:#111111;font-weight:500;">
                      ${item.name}
                    </p>
                  </a>

                  ${
                    item.size
                      ? `<p style="margin:6px 0 0;color:#666666;font-size:13px;">Size: ${item.size}</p>`
                      : ""
                  }

                  <p style="margin:6px 0 0;color:#666666;font-size:13px;">
                    Qty: ${item.quantity}
                  </p>
                </td>

                <td valign="top" align="right" style="color:#111111;font-size:14px;font-weight:500;white-space:nowrap;">
                  ₹${(item.price * item.quantity).toLocaleString("en-IN")}
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
    replyTo: "support@avenorcollection.com",
    to: customerEmail,
    subject: `Avenor Order Confirmation • ${orderNumber}`,

    html: `
      <div style="margin:0;padding:0;background:#f7f7f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f5;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;padding:50px 40px;">

                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:32px;letter-spacing:10px;color:#111111;font-weight:300;">
                      AVENOR
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;">
                    <p style="margin:0;color:#666666;font-size:12px;letter-spacing:2px;">
                      ORDER CONFIRMED
                    </p>

                    <h1 style="margin:12px 0 0;color:#111111;font-size:30px;font-weight:400;">
                      Thank you for your order.
                    </h1>

                    <p style="margin:20px 0 0;color:#555555;font-size:15px;line-height:1.8;">
                      Dear ${customerName}, your order has been received and is now being prepared with care.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;border:1px solid #e5e5e5;">
                    <p style="margin:0;color:#888888;font-size:12px;letter-spacing:1px;">
                      ORDER NUMBER
                    </p>
                    <p style="margin:8px 0 0;font-size:18px;color:#111111;">
                      ${orderNumber}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${itemsHtml}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:30px;border-top:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color:#666666;font-size:15px;">Total Paid</td>
                        <td align="right" style="color:#111111;font-size:22px;font-weight:500;">
                          ₹${total.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:40px;">
                    <a href="https://avenorcollection.com/account/orders" target="_blank" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:16px 40px;font-size:13px;letter-spacing:2px;">
                      VIEW YOUR ORDER
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;color:#666666;font-size:14px;line-height:1.8;">
                    We will notify you again once your order has been shipped.
                    <br /><br />
                    Contact us at
                    <a href="mailto:support@avenorcollection.com" style="color:#111111;text-decoration:none;">
                      support@avenorcollection.com
                    </a>.
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:50px;border-top:1px solid #eeeeee;">
                    <p style="margin:0;font-size:12px;color:#999999;letter-spacing:4px;">
                      AVENOR
                    </p>
                    <p style="margin:12px 0 0;color:#999999;font-size:12px;">
                      Luxury crafted for everyday elegance.
                    </p>
                    <p style="margin:12px 0 0;color:#999999;font-size:12px;">
                      © ${new Date().getFullYear()} Avenor Collection
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
=========================================================
AVENOR STUDIO RESERVATION EMAIL
=========================================================
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
  const productData = products.find(
    (p) => p.id === product
  );

  if (!productData) {
    throw new Error(
      `Product not found for reservation: ${product}`
    );
  }

  const productName = productData.name;

  const coverImagePath = path.join(
    process.cwd(),
    "public",
    productData.coverImage
  );

  const reservationUrl =
    `https://avenorcollection.com/reserve/${product}`;

  const privateAccessUrl =
    "https://avenorcollection.com/account/private-access";

  const imageCid =
    `avenor-${product}-${orderId}@avenorcollection.com`;

  await transporter.sendMail({
    from: `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,
    replyTo: "support@avenorcollection.com",
    to: customerEmail,

    subject: `AVENOR Studio Reservation Confirmed • ${productName}`,

    attachments: [
      {
        filename: `${product}-cover.jpg`,
        path: coverImagePath,
        cid: imageCid,
        contentType: "image/jpeg",
      },
    ],

    html: `
      <div style="margin:0;padding:0;background:#f7f7f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f5;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;padding:50px 40px;">

                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:32px;letter-spacing:10px;color:#111111;font-weight:300;">
                      AVENOR
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;">
                    <p style="margin:0;color:#AF9685;font-size:12px;letter-spacing:2px;">
                      AVENOR STUDIO RESERVATION
                    </p>

                    <h1 style="margin:12px 0 0;color:#111111;font-family:Georgia,serif;font-size:30px;font-weight:400;">
                      Private Access Confirmed
                    </h1>

                    <p style="margin:20px 0 0;color:#555555;font-size:15px;line-height:1.8;">
                      Dear ${customerName}, your AVENOR private studio access has been successfully confirmed.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:35px;">
                    <a href="${reservationUrl}" target="_blank">
                      <img
                        src="cid:${imageCid}"
                        alt="${productName} — AVENOR"
                        width="300"
                        style="display:block;width:300px;max-width:100%;height:auto;margin:0 auto;"
                      />
                    </a>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:24px;">
                    <p style="margin:0;color:#999999;font-size:11px;letter-spacing:2px;">
                      PRIVATE ACCESS FOR
                    </p>

                    <p style="margin:10px 0 0;color:#111111;font-family:Georgia,serif;font-size:27px;">
                      ${productName}
                    </p>

                    <a href="${reservationUrl}" target="_blank" style="display:inline-block;margin-top:15px;color:#AF9685;text-decoration:none;font-size:12px;letter-spacing:2px;">
                      VIEW PIECE →
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:35px;border-top:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color:#666666;font-size:14px;">
                          Reservation Fee
                        </td>
                        <td align="right" style="color:#111111;font-size:18px;">
                          ₹${Number(reservationFee).toLocaleString("en-IN")}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding-top:15px;color:#666666;font-size:14px;">
                          Payment Status
                        </td>
                        <td align="right" style="padding-top:15px;color:#8C9A78;font-size:13px;letter-spacing:1px;">
                          PAID
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:35px;color:#555555;font-size:14px;line-height:1.8;">
                    Your private access to <strong>${productName}</strong> has been recorded with AVENOR before the public release.

                    <br /><br />

                    Our atelier will contact you using the details provided during your reservation.

                    <br /><br />

                    Your reservation provides priority access but does not guarantee final garment allocation.
                    If the reserved piece becomes unavailable, AVENOR will contact you regarding the applicable compensation.
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:35px;border-top:1px solid #eeeeee;">
                    <p style="color:#999999;font-size:11px;letter-spacing:1px;">
                      RESERVATION REFERENCE
                    </p>
                    <p style="color:#555555;font-size:12px;word-break:break-all;">
                      ${orderId}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:40px;">
                    <a href="${privateAccessUrl}" target="_blank" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:16px 40px;font-size:13px;letter-spacing:2px;">
                      VIEW ${productName.toUpperCase()}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:40px;color:#666666;font-size:14px;line-height:1.8;">
                    For assistance, contact
                    <a href="mailto:support@avenorcollection.com" style="color:#111111;text-decoration:none;">
                      support@avenorcollection.com
                    </a>.
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:50px;border-top:1px solid #eeeeee;">
                    <p style="margin:0;font-size:12px;color:#999999;letter-spacing:4px;">
                      AVENOR
                    </p>
                    <p style="margin:12px 0 0;color:#999999;font-size:12px;">
                      Quiet luxury. Limited pieces. Thoughtfully crafted.
                    </p>
                    <p style="margin:12px 0 0;color:#999999;font-size:12px;">
                      © ${new Date().getFullYear()} Avenor Collection
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
=========================================================
AVENOR EXHIBITION PAYMENT NOTIFICATION
=========================================================
*/

interface PaymentCounterEmailProps {
  customerName: string;
  customerPhone: string;

  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];

  total: number;
  paymentReference: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function sendPaymentCounterEmail({
  customerName,
  customerPhone,
  items,
  total,
  paymentReference,
}: PaymentCounterEmailProps) {
  const itemRows = items
    .map((item) => {
      const name = escapeHtml(item.productName);

      return `
        <tr>
          <td style="padding:14px;border-bottom:1px solid #eeeeee;">
            ${name}
          </td>

          <td style="padding:14px;text-align:center;border-bottom:1px solid #eeeeee;">
            ${item.quantity}
          </td>

          <td style="padding:14px;text-align:right;border-bottom:1px solid #eeeeee;">
            ₹${(item.unitPrice * item.quantity).toLocaleString("en-IN")}
          </td>
        </tr>
      `;
    })
    .join("");

  await transporter.sendMail({
    from: `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,

    to: process.env.ADMIN_EMAIL,

    replyTo: "support@avenorcollection.com",

    subject: `AVENOR Payment Received — ₹${total.toLocaleString("en-IN")}`,

    html: `
      <div style="
        margin:0;
        padding:30px 15px;
        background:#FAF8F5;
        font-family:Helvetica,Arial,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          padding:35px;
          background:#ffffff;
          border:1px solid #e8dfd8;
        ">

          <h1 style="
            text-align:center;
            font-weight:300;
            letter-spacing:8px;
            color:#AF9685;
          ">
            AVENOR
          </h1>

          <p style="
            margin-top:35px;
            color:#AF9685;
            font-size:11px;
            letter-spacing:2px;
          ">
            EXHIBITION PAYMENT
          </p>

          <h2 style="
            font-size:25px;
            font-weight:400;
            color:#111111;
          ">
            Payment Successfully Received
          </h2>

          <p style="color:#555555;line-height:1.8;">
            A customer payment has been verified successfully.
          </p>

          <div style="
            margin-top:25px;
            padding:20px;
            background:#F7F5F2;
          ">

            <p style="margin:0 0 12px;color:#777777;font-size:12px;">
              CUSTOMER NAME
            </p>

            <p style="margin:0 0 20px;color:#111111;">
              ${escapeHtml(customerName)}
            </p>

            <p style="margin:0 0 12px;color:#777777;font-size:12px;">
              CONTACT NUMBER
            </p>

            <p style="margin:0;color:#111111;">
              ${escapeHtml(customerPhone)}
            </p>

          </div>

          <h3 style="
            margin-top:30px;
            font-size:13px;
            letter-spacing:1px;
            font-weight:400;
          ">
            PURCHASE DETAILS
          </h3>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="border-collapse:collapse;font-size:13px;"
          >

            <thead>
              <tr>
                <th align="left" style="padding:12px;border-bottom:1px solid #ddd;">
                  Product
                </th>

                <th style="padding:12px;border-bottom:1px solid #ddd;">
                  Qty
                </th>

                <th align="right" style="padding:12px;border-bottom:1px solid #ddd;">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemRows}
            </tbody>

          </table>

          <div style="
            margin-top:25px;
            padding-top:20px;
            border-top:1px solid #e5e5e5;
          ">

            <p style="
              margin:0;
              color:#777777;
              font-size:12px;
              letter-spacing:1px;
            ">
              TOTAL PAID
            </p>

            <p style="
              margin:10px 0;
              color:#AF9685;
              font-size:30px;
            ">
              ₹${total.toLocaleString("en-IN")}
            </p>

          </div>

          <div style="
            margin-top:25px;
            padding:15px;
            background:#f5f7f2;
          ">

            <p style="
              margin:0;
              color:#637b50;
              font-size:13px;
              font-weight:600;
            ">
              ✓ PAYMENT VERIFIED
            </p>

          </div>

          <p style="
            margin-top:25px;
            color:#999999;
            font-size:11px;
            line-height:1.8;
            word-break:break-all;
          ">
            Cashfree Payment Reference: ${escapeHtml(paymentReference)}
          </p>

          <div style="
            margin-top:35px;
            padding-top:25px;
            border-top:1px solid #eeeeee;
            text-align:center;
          ">

            <p style="
              margin:0;
              color:#999999;
              font-size:12px;
              letter-spacing:4px;
            ">
              AVENOR
            </p>

            <p style="
              margin:12px 0 0;
              color:#999999;
              font-size:11px;
            ">
              Quiet luxury. Contemporary fashion.
            </p>

            <p style="
              margin:12px 0 0;
              color:#999999;
              font-size:11px;
            ">
              © ${new Date().getFullYear()} Avenor Collection
            </p>

          </div>

        </div>

      </div>
    `,
  });
}
