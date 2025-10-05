// app/api/brands/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL = "http://103.103.20.23:8080/api";

export async function DELETE(request: Request, context: any) {
  try {
    const id = context?.params?.id; // <- ambil id aman via any

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/brands/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: true };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
