// app/actions/getSession.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // lib se import karo

export default async function getSession() {
  return await getServerSession(authOptions);
}
