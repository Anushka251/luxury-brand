import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    // 🔐 EMAIL / PASSWORD LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) return null;

        const isMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),

    // 🌐 GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  // ✅ USE YOUR CUSTOM LOGIN PAGE
  pages: {
    signIn: "/auth",
  },

  // ✅ JWT SESSION
  session: {
    strategy: "jwt",
  },

  // ✅ KEEP AUTH STABLE (NO FORCED REDIRECTS)
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };