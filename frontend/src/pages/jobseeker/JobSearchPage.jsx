import { useState, useEffect } from "react";
import JobSearchSummary from "../../components/jobseeker/jobs/JobSearchSummary";
import JobResultsToolbar from "../../components/jobseeker/jobs/JobResultsToolbar";
import JobListingLayout from "../../components/jobseeker/jobs/JobListingLayout";
import { JOB_SORT_OPTIONS } from "../../constants/constants";
import { useSearchParams } from "react-router-dom";

const JobSearchPage = () => {
  const [search, setSearch] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [location, setLocation] = useState("");
  const [ordering, setOrdering] = useState(
    JOB_SORT_OPTIONS[0].value // "-published_at"
  );
  const [pageSize, setpageSize] = useState(12)
  const [page, setPage] = useState(1); 
  const [searchParams, setSearchParams] = useSearchParams();

  const INITIAL_FILTERS = {
    location: "",
    workMode: [],
    jobType: [],
    experience: [],
    postedWithin: "",
    salaryMin: "",
    salaryMax: "",
  };

  const [filters, setFilters] = useState(() => ({
    location: searchParams.get("location") || "",
    workMode: searchParams.get("work_mode")?.split(",") || [],
    jobType: searchParams.get("job_type")?.split(",") || [],
    experience: searchParams.get("experience")?.split(",") || [],
    postedWithin: searchParams.get("posted_within") || "",
    salaryMin: searchParams.get("salary_min") || "",
    salaryMax: searchParams.get("salary_max") || "",
  }));

const [salaryDraft, setSalaryDraft] = useState({
  min: "",
  max: "",
});

  const shownCount =
    jobCount === 0 ? 0 : Math.min(page * pageSize, jobCount);




  const handleSearch = () => {
    setTrigger((prev) => prev + 1); 
  };


useEffect(() => {
  const params = {};

  if (filters.location) params.location = filters.location;
  if (filters.workMode.length) params.work_mode = filters.workMode.join(",");
  if (filters.jobType.length) params.job_type = filters.jobType.join(",");
  if (filters.experience.length) params.experience = filters.experience.join(",");
  if (filters.postedWithin) params.posted_within = filters.postedWithin;
  if (filters.salaryMin) params.salary_min = filters.salaryMin;
  if (filters.salaryMax) params.salary_max = filters.salaryMax;

  setSearchParams(params, { replace: true });
}, [filters]);

const resetAllFilters = () => {
  setFilters(INITIAL_FILTERS);
  setSalaryDraft({ min: "", max: "" });
  setPage(1);
  setSearchParams({}, { replace: true });
};



  return (
    <div>
      <JobSearchSummary
        search={search}
        setSearch={setSearch}
        setLocation={setLocation}
        onSearch={handleSearch}
        jobCount={jobCount}
        
      />
    <JobResultsToolbar
      ordering={ordering}
      onOrderingChange={setOrdering}
      onpageSizeChange={setpageSize}
      shown={shownCount}
      jobCount={jobCount}
      // onReset={handleReset}
      onResetAll={resetAllFilters}
    />
      <JobListingLayout
        search={search}
        location={location}
         ordering={ordering}
        trigger={trigger}
        setJobCount={setJobCount}
        pageSize={pageSize}
        page={page} 
        setPage={setPage}
        jobCount={jobCount}
        filters={filters}
        setFilters={setFilters}
        searchParams={searchParams}

  salaryDraft={salaryDraft}
  setSalaryDraft={setSalaryDraft}
  onApplySalary={() => {
    setFilters((prev) => ({
      ...prev,
      salaryMin: salaryDraft.min,
      salaryMax: salaryDraft.max,
    }));
    setPage(1);
  }}
  onResetSalary={() => {
    setSalaryDraft({ min: "", max: "" });
    setFilters((prev) => ({
      ...prev,
      salaryMin: "",
      salaryMax: "",
    }));
    setPage(1);
  }}



      />
    </div>
  );
};

export default JobSearchPage;
