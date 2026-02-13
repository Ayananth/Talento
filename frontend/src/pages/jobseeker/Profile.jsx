import React from "react";
import ResumeUploadCard from "@/components/jobseeker/ResumeUploadCard";

const Profile = () => {
  return (
    <>
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <ResumeUploadCard />
        </div>
      </div>
    </>
  );
};

export default Profile;
