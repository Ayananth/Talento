import { useState } from "react";
import JobSearchSummary from "../../components/jobseeker/jobs/JobSearchSummary";
import JobResultsToolbar from "../../components/jobseeker/jobs/JobResultsToolbar";
import JobListingLayout from "../../components/jobseeker/jobs/JobListingLayout";

const JobSearchPage = () => {
  const [search, setSearch] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [location, setLocation] = useState("");


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
      <JobResultsToolbar />
      <JobListingLayout
        search={search}
        location={location}
        trigger={trigger}
        setJobCount={setJobCount}
      />
    </div>
  );
};

export default JobSearchPage;
