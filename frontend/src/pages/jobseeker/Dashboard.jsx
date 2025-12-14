import React from 'react'
import ProfileHeader from '@/components/jobseeker/ProfileHeader'
import Sidebar from '@/components/jobseeker/Sidebar'
import ResumeUploadCard from '@/components/jobseeker/ResumeUploadCard'
import KeySkillsCard from '@/components/jobseeker/KeySkillsCard'
import EmploymentCard from '@/components/jobseeker/EmploymentCard'
import EducationCard from '@/components/jobseeker/EducationCard'
import { Navbar } from '@/components/common/Navbar'

const Dashboard = () => {
  return (
    <>
        <Navbar />

      <div className="pt-[100px] bg-gray-50 min-h-screen" style={{ marginTop: "20px" }}>

        <div className="max-w-7xl mx-auto px-4">

          {/* PROFILE HEADER */}
          <ProfileHeader className="mt-96" />

          {/* MAIN LAYOUT */}
          <div className="flex gap-6 mt-6">
            
            {/* SIDEBAR */}
            <div className="w-64">
              <Sidebar />
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="flex-1">
              <div className="flex flex-col gap-6">
                <ResumeUploadCard />
                <KeySkillsCard />
                <EmploymentCard />
                <EducationCard />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
