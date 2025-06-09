import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ✅ Extract text fields
    const jobDescription = formData.get("jobDescription") as string;
    const sourcingGuideline = formData.get("sourcingGuideline") as string;
    const email = formData.get("email") as string;

    // ✅ Extract resume file
    const resumeFile = formData.get("resume") as unknown as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "Resume file missing" },
        { status: 400 }
      );
    }

    // ✅ Directly convert file to buffer
    const buffer = Buffer.from(await resumeFile.arrayBuffer());

    // ✅ Build FormData to forward to external server
    const uploadForm = new FormData();
    uploadForm.append("job_description", jobDescription);
    uploadForm.append("job_sourcing_guideline", sourcingGuideline);
    uploadForm.append("email", email);
    uploadForm.append("resume", buffer, resumeFile.name);

    // ✅ Forward request to external API
    const response = await axios.post(
      "http://35.198.248.218:8000/match_resume",
      uploadForm,
      { headers: uploadForm.getHeaders() }
    );

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
