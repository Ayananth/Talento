const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockParseResume = async (file) => {
  await wait(1800);

  const baseName = file?.name?.replace(/\.[^.]+$/, "") || "Candidate";

  return {
    skills: "React, JavaScript, Node.js, REST APIs, PostgreSQL",
    education_details: `B.Tech in Computer Science - Sample University (2018 - 2022)`,
    employment_details: `Software Engineer at ${baseName} Labs (2022 - Present)
- Built internal dashboards with React
- Worked on API integration and performance optimization`,
    projects_summary: `1) Job Matching Assistant: Built a recommendation module for role matching.
2) Resume Analyzer: Parsed resumes and extracted structured profile data.`,
  };
};

export const mockConfirmParsedResume = async ({ file, details }) => {
  await wait(1200);

  return {
    id: Date.now(),
    title: file?.name?.replace(/\.[^.]+$/, "") || "My Resume",
    uploaded_at: new Date().toISOString(),
    is_default: false,
    file_url: file ? URL.createObjectURL(file) : "",
    parsed_details: details,
  };
};
