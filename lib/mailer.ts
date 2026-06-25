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
            font-family:
              Helvetica,
              Arial,
              sans-serif;
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
