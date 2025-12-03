import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Only export GET and POST for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
