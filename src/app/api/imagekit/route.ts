import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET() {
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Missing ImageKit environment variables" },
        { status: 500 },
      );
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);

    return NextResponse.json(
      { error: "Failed to generate ImageKit authentication parameters" },
      { status: 500 },
    );
  }
}
