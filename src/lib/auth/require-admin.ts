import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}
