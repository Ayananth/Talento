import React from 'react'
import JobSearchSummary from '../../components/jobseeker/jobs/JobSearchSummary'
import JobResultsToolbar from '../../components/jobseeker/jobs/JobResultsToolbar'
import JobListingLayout from '../../components/jobseeker/jobs/JobListingLayout'

const JobSearchPage = () => {
  return (
    <div>
      <JobSearchSummary/>
      <JobResultsToolbar/>
      <JobListingLayout />
    </div>
  )
}

export default JobSearchPage
