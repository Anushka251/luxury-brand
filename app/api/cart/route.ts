import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

// ✅ SAVE CART
export async function POST(req: Request) {
  const { email, cart } = await req.json();

  await connectDB();

  const existing = await Cart.findOne({ userEmail: email });

  if (existing) {
    existing.items = cart;
    await existing.save();
  } else {
    await Cart.create({
      userEmail: email,
      items: cart,
    });
  }

  return Response.json({ success: true });
}

// ✅ GET CART
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  await connectDB();

  const cart = await Cart.findOne({ userEmail: email });

  return Response.json({
    items: cart?.items || [],
  });
}