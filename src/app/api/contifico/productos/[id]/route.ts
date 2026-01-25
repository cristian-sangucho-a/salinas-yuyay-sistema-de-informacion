import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 },
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = new URL(`${apiUrl}/producto/${id}/`);

    // Add POS token if available
    if (token) {
      url.searchParams.append("pos", token);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
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
            "Error fetching product from Contifico",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno";
    console.error("Error fetching Contifico product:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 },
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = new URL(`${apiUrl}/producto/${id}/`);

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
        { status: response.status },
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
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = process.env.CONTIFICO_API_KEY;
  const token = process.env.CONTIFICO_API_TOKEN;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO_API_KEY" },
      { status: 500 },
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const apiUrl = process.env.CONTIFICO_API_URL;
    const url = new URL(`${apiUrl}/producto/${id}/`);

    // Add POS token if available
    if (token) {
      url.searchParams.append("pos", token);
    }

    // Contifico API often returns 405 Method Not Allowed for DELETE.
    // Instead, we perform a "soft delete" by updating the status to "I" (Inactive).
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: "I" }),
    });

    if (!response.ok) {
      // If PUT fails, we try to parse the error
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // If the error is 405 on PUT as well, we are stuck, but unlikely for an update.
      return NextResponse.json(
        {
          error:
            errorData.mensaje ||
            errorData.error ||
            "Error deactivating product in Contifico",
          details: errorData,
        },
        { status: response.status },
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
