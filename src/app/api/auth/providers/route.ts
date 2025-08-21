import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Return available providers
    const providers = {
      credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
      },
    };

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Providers API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
