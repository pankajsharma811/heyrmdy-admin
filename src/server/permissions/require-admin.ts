import { authOptions } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/error";
import { getServerSession } from "next-auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError("Authentication Required");
  }

  return session.user;
}
