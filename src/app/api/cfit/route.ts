import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { sourcingGuideline } = await req.json();

    if (!sourcingGuideline) {
      return NextResponse.json(
        { error: "Missing sourcing guideline" },
        { status: 400 }
      );
    }

    // Build request body for external API
    const requestBody = {
      job_sourcing_guideline: sourcingGuideline,
    };

    const externalResponse = await axios.post(
      "http://35.198.248.218:8000/c_fit/",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(externalResponse.data);
  } catch (error) {
    console.error("C-Fit API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch C-Fit result" },
      { status: 500 }
    );
  }
}
