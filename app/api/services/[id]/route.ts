import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://103.103.20.23:8080/api";

// ⚡ FIX: hapus deklarasi type eksplisit di argumen ke-2
export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const formData = await request.formData().catch(() => new FormData());
    const authHeader = request.headers.get("authorization");

    const name = searchParams.get("name") || "";
    const shortDesc = searchParams.get("shortDesc") || "";
    const longDesc = searchParams.get("longDesc") || "";
    const imageFile = formData.get("imageFile") as File | null;

    // 🔹 Siapkan URL backend (gunakan query param sesuai API backend kamu)
    const backendUrl = new URL(`${BACKEND_URL}/services/${id}`);
    backendUrl.searchParams.set("name", name);
    backendUrl.searchParams.set("shortDesc", shortDesc);
    backendUrl.searchParams.set("longDesc", longDesc);

    // 🔹 Selalu buat FormData agar tetap multipart
    const body = new FormData();
    if (imageFile) {
      body.append("imageFile", imageFile);
    }

    const res = await fetch(backendUrl.toString(), {
      method: "PUT",
      headers: authHeader ? { Authorization: authHeader } : {},
      body: body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend response:", text);
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: true };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}
