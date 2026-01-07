import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = process.env.CONTIFICO_API_TOKEN;
  const apiKey = process.env.CONTIFICO_API_KEY;

  if (!token || !apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing CONTIFICO credentials" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const apiUrl = process.env.CONTIFICO_API_URL;

    const response = await fetch(`${apiUrl}/persona/?pos=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Contifico API error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
