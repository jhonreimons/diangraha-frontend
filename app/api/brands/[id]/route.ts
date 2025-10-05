import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://103.103.20.23:8080/api";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const response = await fetch(`${BACKEND_URL}/brands/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Kadang DELETE API nggak return body
    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: true };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
