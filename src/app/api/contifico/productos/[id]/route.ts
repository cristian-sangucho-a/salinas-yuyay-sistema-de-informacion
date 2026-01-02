import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const url = new URL(
      `https://api.contifico.com/sistema/api/v1/producto/${id}/`
    );

    // Add POS token if available
    if (token) {
      url.searchParams.append("pos", token);
    }

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return NextResponse.json(
        {
          error:
            errorData.mensaje ||
            errorData.error ||
            "Error updating product in Contifico",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const text = await response.text();
    if (!text) {
      return NextResponse.json({ success: true });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ success: true, message: text });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno";
    console.error("Error updating Contifico product:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(
      `https://api.contifico.com/sistema/api/v1/producto/${id}/`
    );

    // Add POS token if available
    if (token) {
      url.searchParams.append("pos", token);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return NextResponse.json(
        {
          error:
            errorData.mensaje ||
            errorData.error ||
            "Error deleting product in Contifico",
          details: errorData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno";
    console.error("Error deleting Contifico product:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
