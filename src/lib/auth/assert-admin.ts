import { currentUser } from "@clerk/nextjs/server";

export async function assertAdmin() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You need to sign in first.");
  }

  if (user.publicMetadata?.role !== "admin") {
    throw new Error("You are not authorized to perform this action.");
  }

  return user;
}
