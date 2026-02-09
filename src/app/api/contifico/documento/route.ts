import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;

  if (!apiKey || !token) {
    return NextResponse.json(
      { error: "Server configuration error: Missing Credentials" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    // Inyectar el token POS en el cuerpo si no viene (aunque nuestra logica cliente no lo enviara para mantenerlo seguro)
    const payload = {
      ...body,
      pos: token,
    };

    if (payload.tipo === "PRE") {
      console.log(
        "Creando PREFACTURA en Contifico:",
        JSON.stringify(payload, null, 2),
      );
    }

    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = `${apiUrl}/documento/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Error respuesta Contífico API:",
        response.status,
        errorText,
      );
      // Intentar parsear el error si es JSON para enviarlo limpio
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: response.status });
      } catch {
        return NextResponse.json(
          { error: `Error Contífico API: ${errorText}` },
          { status: response.status },
        );
      }
    }

    const data = await response.json();
    console.log("Respuesta Contífico API (Documento creado):", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating Contifico document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
