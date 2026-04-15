import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

// ✅ SAVE / UPDATE CART (FIXED - NO VERSION ERROR)
export async function POST(req: Request) {
  try {
    const { email, cart } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();

    // ✅ ATOMIC UPDATE (NO .save())
    await Cart.findOneAndUpdate(
      { userEmail: email },
      { $set: { items: cart } },
      {
        new: true,
        upsert: true, // creates if not exists
      }
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Cart POST error:", err);
    return Response.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

// ✅ GET CART
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ items: [] });
    }

    await connectDB();

    const cart = await Cart.findOne({ userEmail: email });

    return Response.json({
      items: cart?.items || [],
    });
  } catch (err) {
    console.error("Cart GET error:", err);
    return Response.json({ items: [] });
  }
}