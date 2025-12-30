import api from "../api";

export const getJobs = async ({
  page = 1,
  ordering = "-published_at",
  search = "",
  location = "",
  pageSize = "12",
  filters = {},
} = {}) => {
  console.log("Filters: ",filters)
  const res = await api.get("/v1/jobs/jobs/public/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(search && { search }),
      ...(location && { location_city: location }),
      ...(pageSize && {page_size: pageSize}),

      ...(filters&& filters.workMode&&filters.workMode.length && {
        work_mode: filters.workMode.join(","),
      }),

      ...(filters.jobType.length && {
        job_type: filters.jobType.join(","),
      }),
      ...(filters.experience.length && {
        experience_level: filters.experience.join(","),
      }),
      ...(filters.postedWithin && {
        published_after: filters.postedWithin,
      }),
      ...(filters.salaryMin && {
        salary_min: filters.salaryMin,
      }),
      ...(filters.salaryMax && {
        salary_max: filters.salaryMax,
      }),



    },
  });

  return res.data;
};




export const getJobDetail = async (id) => {
  const res = await api.get(`/v1/jobs/jobs/public/${id}/`);
  return res.data;
};





export const getMyResumes = async () => {
  const res = await api.get("/v1/profile/me/resumes/");
  return res.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);

  const res = await api.post("v1/profile/me/resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const applyToJob = async ({
  jobId,
  resumeId,
  file,
  coverLetter,
  currentSalary,
  expectedSalary,
  noticePeriod,
}) => {
  const formData = new FormData();

  // 🔑 Required
  formData.append("job", jobId);
  formData.append("expected_salary", expectedSalary);

  // 🔁 Resume logic (IMPORTANT)
  if (resumeId) {
    // Existing resume → backend will copy in Cloudinary
    formData.append("resume_id", resumeId);
  } else if (file) {
    // New resume → backend uploads file
    formData.append("resume", file);
  } else {
    throw new Error("Either resumeId or file must be provided");
  }

  // Optional fields
  if (coverLetter) {
    formData.append("cover_letter", coverLetter);
  }

  if (currentSalary !== null && currentSalary !== undefined) {
    formData.append("current_salary", currentSalary);
  }

  if (noticePeriod) {
    formData.append("notice_period", noticePeriod);
  }

  const res = await api.post(
    "/v1/applications/apply/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
