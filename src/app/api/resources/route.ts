import { NextResponse } from "next/server";
import {
  saveResourceToDB,
  getUserResourcesFromDB,
} from "@/lib/server/resource-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveResourceToDB(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/resources failed:", error);

    return NextResponse.json(
      { ok: false, error: "Something went wrong while saving the resource." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const result = await getUserResourcesFromDB();

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/resources failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while fetching your resources.",
      },
      { status: 500 },
    );
  }
}
