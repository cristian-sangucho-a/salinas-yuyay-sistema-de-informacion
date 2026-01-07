import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filtro");
  const fecha_inicial = searchParams.get("fecha_inicial");
  const fecha_final = searchParams.get("fecha_final");

  try {
    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = new URL(`${apiUrl}/producto/`);

    // Add POS token if available (consistent with persona route)
    if (token) {
      url.searchParams.append("pos", token);
    }

    if (filter) {
      url.searchParams.append("filtro", filter);
    }

    // Add date range filters for weekly loading
    if (fecha_inicial) {
      url.searchParams.append("fecha_inicial", fecha_inicial);
    }
    if (fecha_final) {
      url.searchParams.append("fecha_final", fecha_final);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error Contifico API (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // If the API returns an array directly, format it as a simple response
    if (Array.isArray(data)) {
      return NextResponse.json({
        productos: data,
        total: data.length,
      });
    }

    // If API already returns a response with productos array, return it as is
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno";
    console.error("Error fetching Contifico products:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = new URL(`${apiUrl}/producto/`);

    // Add POS token if available
    if (token) {
      url.searchParams.append("pos", token);
    }

    // Create product in Contífico
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error Contifico API (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Retornar la respuesta de Contífico con el producto creado
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno";
    console.error("Error creating Contifico product:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
