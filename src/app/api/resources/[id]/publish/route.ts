// src/app/api/resources/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { setPublishedStatusInDB } from "@/lib/server/resource-service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const result = await setPublishedStatusInDB(id, body.published);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/resources/[id]/publish failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while updating publish status.",
      },
      { status: 500 },
    );
  }
}
