import { NextResponse } from "next/server";
import { deleteResourceInDB } from "@/app/actions/resource";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  const result = await deleteResourceInDB(id);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: result.data,
  });
}
