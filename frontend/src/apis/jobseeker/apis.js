import api from "../api";

export const getJobs = async ({
  page = 1,
  ordering = "-published_at",
  search = "",
  location = "",
  recruiterId = "",
  pageSize = "12",
  filters = {},
} = {}) => {
  const res = await api.get("/v1/jobs/jobs/public/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(search && { search }),
      ...(location && { location_city: location }),
      ...(recruiterId && { recruiter_id: recruiterId }),
      ...(pageSize && {page_size: pageSize}),

      ...(filters?.workMode?.length && {
        work_mode: filters.workMode.join(","),
      }),

      ...(filters?.jobType?.length && {
        job_type: filters.jobType.join(","),
      }),
      ...(filters?.experience?.length && {
        experience_level: filters.experience.join(","),
      }),
      ...(filters?.postedWithin && {
        posted_within: filters.postedWithin,
      }),
      ...(filters?.salaryMin && {
        salary_min: filters.salaryMin,
      }),
      ...(filters?.salaryMax && {
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

export const getMyProfile = async () => {
  const res = await api.get("/v1/profile/me/");
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
  phone,
  location,
  experience,
  currentRole,
  coverLetter,
  currentSalary,
  expectedSalary,
  noticePeriod,
}) => {
  const formData = new FormData();

  formData.append("job", Number(jobId));
  formData.append("expected_salary", Number(expectedSalary));
  formData.append("phone", phone);
  formData.append("location", location);
  if (experience !== null && experience !== undefined) {
  formData.append("experience", Number(experience));
}
  formData.append("current_role", currentRole);

  if (resumeId) {
    formData.append("resume_id", resumeId);
  } else if (file) {
    formData.append("resume", file);
  } else {
    throw new Error("Either resumeId or file must be provided");
  }

  if (coverLetter) {
    formData.append("cover_letter", coverLetter);
  }

  if (currentSalary !== null && currentSalary !== undefined) {
    formData.append("current_salary", Number(currentSalary));
  }

  if (noticePeriod) {
    formData.append("notice_period", noticePeriod);
  }

  const res = await api.post("/v1/applications/apply/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


export const getMyApplications = async ({
  page = 1,
  status = "",
  ordering = "-applied_at",
  search = "",
} = {}) => {
  const res = await api.get("/v1/applications/my-applications/", {
    params: {
      page,
      ...(status && { status }),
      ...(ordering && { ordering }),
      ...(search && { search }),
    },
  });

  return res.data;
};


export const getSavedJobs = async ({
  page = 1,
  ordering = "-created_at",
}) => {
  const res = await api.get("v1/jobs/jobs/public/saved/", {
    params: {
      page,
      ordering,
    },
  });
  return res.data;
};

export const getJobseekerNotifications = async ({
  page = 1,
  ordering = "-created_at",
  isRead = "",
} = {}) => {
  const res = await api.get("/v1/notifications/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(isRead !== "" && { is_read: isRead }),
    },
  });

  return res.data;
};

export const updateJobseekerNotificationReadStatus = async (
  notificationId,
  isRead
) => {
  const res = await api.patch(
    `/v1/notifications/${notificationId}/read-status/`,
    { is_read: isRead }
  );
  return res.data;
};

export const getJobseekerUnreadNotificationsCount = async () => {
  const res = await api.get("/v1/notifications/", {
    params: {
      page: 1,
      is_read: false,
    },
  });

  return res.data?.count ?? 0;
};

export const markAllJobseekerNotificationsRead = async () => {
  const res = await api.patch("/v1/notifications/mark-all-read/");
  return res.data;
};
