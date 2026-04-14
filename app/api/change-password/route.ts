import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, currentPassword, newPassword } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return Response.json({ error: "Incorrect current password" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  await user.save();

  return Response.json({ success: true });
}