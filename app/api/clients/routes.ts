import { NextResponse } from "next/server";

const BACKEND_URL = "http://103.103.20.23:8080/api";

export async function DELETE(request: Request, context: any) {
  try {
    const id = context?.params?.id; // Ambil ID dari dynamic route

    if (!id) {
      return NextResponse.json({ error: "Missing client ID" }, { status: 400 });
    }


    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // 🔥 Panggil API backend
    const response = await fetch(`${BACKEND_URL}/clients/${id}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: authHeader,
      },
    });

    // ❌ Kalau gagal
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend delete failed:", response.status, errorText);
      return NextResponse.json(
        { error: `Failed to delete client. Status: ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: true };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting client:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting client" },
      { status: 500 }
    );
  }
}
