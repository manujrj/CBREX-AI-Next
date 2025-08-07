import { Candidate } from "@/types/matching";

export const sanitizeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const buildInsight = (descriptionObj: Candidate): string => {
  const descriptionRaw = descriptionObj as unknown as Record<
    string,
    string | string[]
  >;
  const parts: string[] = [];

  const keyOrder = [
    "Skills Vs Experience Check",
    "Qualification & Certification Fitment",
    "Gaps In Experience",
    "Additional Observations",
    "Achievements",
  ];

  for (const key of keyOrder) {
    if (descriptionRaw.hasOwnProperty(key)) {
      const value = descriptionRaw[key];
      const heading = `<div style="margin-bottom: 8px;"><strong>${sanitizeHTML(key)}</strong></div>`;

      // Check if value is an array and format as bullet points
      let content;
      if (Array.isArray(value)) {
        const listItems = value
          .map((item) => `<li style="margin-bottom: 4px;">${sanitizeHTML(item)}</li>`)
          .join("");
        content = `<ul style="margin-left: 20px; margin-bottom: 16px; list-style-type: disc;">${listItems}</ul>`;
      } else {
        content = `<div style="margin-bottom: 16px;">${sanitizeHTML(value)}</div>`;
      }

      parts.push(`${heading}${content}`);
    }
  }

  for (const [key, value] of Object.entries(descriptionRaw)) {
    if (!keyOrder.includes(key)) {
      const heading = `<div style="margin-bottom: 8px;"><strong>${sanitizeHTML(key)}</strong></div>`;

      // Check if value is an array and format as bullet points
      let content;
      if (Array.isArray(value)) {
        const listItems = value
          .map((item) => `<li style="margin-bottom: 4px;">${sanitizeHTML(item)}</li>`)
          .join("");
        content = `<ul style="margin-left: 20px; margin-bottom: 16px; list-style-type: disc;">${listItems}</ul>`;
      } else {
        content = `<div style="margin-bottom: 16px;">${sanitizeHTML(value)}</div>`;
      }

      parts.push(`${heading}${content}`);
    }
  }

  return parts.join("");
};
