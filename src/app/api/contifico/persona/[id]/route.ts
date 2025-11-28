import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.CONTIFICO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 }
    );
  }

  try {
    // Search by identification (Cedula/RUC) instead of ID
    const response = await fetch(
      `https://api.contifico.com/sistema/api/v1/persona/?identificacion=${id}`,
      {
        headers: {
          Authorization: `${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Contifico API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // If array is empty, return 404 to signal "not found" to frontend
    if (Array.isArray(data) && data.length === 0) {
      return NextResponse.json(
        { error: "Persona no encontrada" },
        { status: 404 }
      );
    }

    // If we get results, return the first one (should be unique by cedula)
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching persona:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
