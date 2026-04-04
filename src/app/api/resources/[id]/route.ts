import { NextResponse } from "next/server";
import {
  getResourceFromDB,
  updateResourceInDB,
} from "@/lib/server/resource-service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await getResourceFromDB(id);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 404 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/resources/[id] failed:", error);

    return NextResponse.json(
      { ok: false, error: "Something went wrong while fetching the resource." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const result = await updateResourceInDB(id, body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/resources/[id] failed:", error);

    return NextResponse.json(
      { ok: false, error: "Something went wrong while updating the resource." },
      { status: 500 },
    );
  }
}
