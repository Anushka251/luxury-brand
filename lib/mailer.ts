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

interface OrderEmailProps {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: any[];
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
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;">
            ${item.name}
          </td>

          <td style="padding:8px;">
            ${item.quantity}
          </td>

          <td style="padding:8px;">
            ₹${item.price.toLocaleString()}
          </td>
        </tr>
      `
    )
    .join("");

  await transporter.sendMail({
    from: `"Avenor Collection" <${process.env.ZOHO_EMAIL}>`,
    to: customerEmail,

    subject: `Order Confirmed - ${orderNumber}`,

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Thank you for shopping with Avenor Collection.</h2>

        <p>Hi ${customerName},</p>

        <p>
          Your order has been confirmed.
        </p>

        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <table
          width="100%"
          border="1"
          cellspacing="0"
          cellpadding="0"
          style="border-collapse:collapse;margin-top:20px;"
        >
          <thead>
            <tr>
              <th style="padding:8px;">
                Product
              </th>

              <th style="padding:8px;">
                Qty
              </th>

              <th style="padding:8px;">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="margin-top:20px;">
          Total: ₹${total.toLocaleString()}
        </h3>

        <p>
          We will notify you once your order is shipped.
        </p>

        <p>
          If you have any questions, reply to this email or contact us at
          support@avenorcollection.com.
        </p>

        <br />

        <p>
          Regards,
          <br />
          Avenor Collection
        </p>
      </div>
    `,
  });
}
