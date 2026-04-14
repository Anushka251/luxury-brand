import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const existing = await User.findOne({ email });

  if (existing) {
    return Response.json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
  });

  return Response.json({ success: true });
}