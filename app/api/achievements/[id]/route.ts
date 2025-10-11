// app/api/achievements/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL = "http://103.103.20.23:8080/api";

export async function DELETE(request: Request, context: any) {
  try {
    const id = context?.params?.id; // <- ambil id aman via any

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/achievements/${id}`, {
      method: "DELETE",
      headers: {
        'accept': '*/*',
        'Authorization': authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: true };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
