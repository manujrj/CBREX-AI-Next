import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sourcingGuideline = formData.get("sourcingGuideline") as string;
    const email = formData.get("email") as string;
    const jobDescription = formData.get(
      "jobDescription"
    ) as unknown as File | null;
    const resumeFile = formData.get("resume") as unknown as File;

    if (!resumeFile) {
      console.error("Resume file missing");
      return NextResponse.json(
        { error: "Resume file missing" },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      console.error("Job description missing");
      // return NextResponse.json(
      //   { error: "Job Description file missing" },
      //   { status: 400 }
      // );
    }

    const uploadForm = new FormData();
    uploadForm.append("job_description", "");
    uploadForm.append("job_sourcing_guideline", sourcingGuideline);
    uploadForm.append("email", email);

    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const resumeName = resumeFile?.name || "resume.docx";
    uploadForm.append("resume", buffer, resumeName);

    if (jobDescription && typeof jobDescription.arrayBuffer === "function") {
      const buffer_jd = Buffer.from(await jobDescription.arrayBuffer());
      const jdName = jobDescription.name || "job_description.docx";
      uploadForm.append("job_description_file", buffer_jd, jdName);
    }

    const response = await axios.post(
      "http://35.198.248.218:8000/match_resume_d",
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
