import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "@/lib/db";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }

        try {
          const query = "SELECT * FROM users WHERE email = ?";
          const response = await db.query(query, [credentials.email]);

          if (response.length === 0 || response[0].length === 0) {
            throw new Error("User not found.");
          }

          const user = response[0][0];

          const passwordCorrect = await compare(credentials.password, user.password);

          if (!passwordCorrect) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error("Error during user authentication:", error.message);
          throw new Error("Authentication failed.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", 
    error: "/auth/error",  
  },
});

export { handler as GET, handler as POST };
