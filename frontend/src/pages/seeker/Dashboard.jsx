import React from 'react'
import jobseekerDash from '../../assets/jobseeker/images/jobseekerDash.png'
import ProfileHeader from '../../components/seeker/ProfileHeader'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto mt-5">
        {/* <img src={jobseekerDash} alt="" /> */}
        <ProfileHeader />
    </div>
  )
}

export default Dashboard
