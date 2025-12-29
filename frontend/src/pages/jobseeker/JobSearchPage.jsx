import { useState } from "react";
import JobSearchSummary from "../../components/jobseeker/jobs/JobSearchSummary";
import JobResultsToolbar from "../../components/jobseeker/jobs/JobResultsToolbar";
import JobListingLayout from "../../components/jobseeker/jobs/JobListingLayout";
import { JOB_SORT_OPTIONS } from "../../constants/constants";

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
  
  const shownCount =
    jobCount === 0 ? 0 : Math.min(page * pageSize, jobCount);




  const handleSearch = () => {
    setTrigger((prev) => prev + 1); 
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
      />
    </div>
  );
};

export default JobSearchPage;
