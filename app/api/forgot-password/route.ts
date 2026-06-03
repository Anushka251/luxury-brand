import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        error: "Email required",
      });
    }

    // Connect database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token to database
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await user.save();

    // Reset link
    const resetLink = `https://avenorcollection.com/reset-password?token=${token}`;

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>

        <p>
          Click the button below to reset your password:
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:black;
            color:white;
            text-decoration:none;
            margin-top:16px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;">
          This link expires in 1 hour.
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
