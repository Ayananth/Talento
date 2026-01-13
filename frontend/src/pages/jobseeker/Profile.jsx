import React from "react";
import ResumeUploadCard from "@/components/jobseeker/ResumeUploadCard";
import KeySkillsCard from "@/components/jobseeker/KeySkillsCard";
import EmploymentCard from "@/components/jobseeker/EmploymentCard";
import EducationCard from "@/components/jobseeker/EducationCard";

const Profile = () => {
  return (
    <>
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <ResumeUploadCard />
          <KeySkillsCard />
          <EmploymentCard />
          <EducationCard />
        </div>
      </div>
    </>
  );
};

export default Profile;
