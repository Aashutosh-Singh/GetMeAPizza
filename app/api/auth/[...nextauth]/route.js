// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export const authOptions = {
  session: {
    strategy: "jwt", // ✅ JWT only
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
          authProvider: "local",
        });

        if (!user) throw new Error("No user found with this email");
        if (!user.verified) throw new Error("Please verify your email");

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          handle: user.handle,
          profile: user.profile,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.handle = user.handle;
       
        token.name = user.name;
        token.profile = user.profile;
        token.email = user.email;
       
      }
      
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        handle: token.handle,
        
        name: token.name,
        email: token.email,
        profile: token.profile,
      };
      
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
