import React from 'react'
import ProfileHeader from '../../components/seeker/ProfileHeader'
import Sidebar from '../../components/seeker/Sidebar'
import ResumeUploadCard from '../../components/seeker/ResumeUploadCard'
import ResumeHeadlineCard from '../../components/seeker/ResumeHeadlineCard'
import KeySkillsCard from '../../components/seeker/KeySkillsCard'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto mt-5 px-4">
      <ProfileHeader />

      <div className="flex gap-6 mt-6">
        <div className="w-64">
          <Sidebar />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-6">
            <ResumeUploadCard />
            <ResumeHeadlineCard />
            <KeySkillsCard />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
