import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecruiterJobDetail, updateJob } from "@/apis/recruiter/apis";
import JobForm from "../../components/recruiter/forms/JobForm";
import Toast from "@/components/common/Toast";



export default function RecruiterJobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getRecruiterJobDetail(id);

        setInitialData({
          title: res.title,
          description: res.description,
          job_type: res.job_type,
          work_mode: res.work_mode,
          experience_level: res.experience_level,
          location_city: res.location_city || "",
          location_state: res.location_state || "",
          location_country: res.location_country || "India",
          salary_min: res.salary_min || "",
          salary_max: res.salary_max || "",
          salary_hidden: res.salary_hidden,
          openings: res.openings,
          expires_at: res.expires_at?.slice(0, 10), // date input
          skills: res.skills.join(", "), // IMPORTANT
        });
      } catch (err) {
        console.error("Failed to load job", err);
        navigate("/recruiter/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) return <p className="p-6">Loading job…</p>;
  if (!initialData) return null;

  return (
    <>
      <JobForm
        initialData={initialData}
        submitLabel="Update Job"
        loading={loading}
        onSubmit={async (payload) => {
          try {
            setLoading(true);
            await updateJob(id, payload);

            setToast({
              type: "success",
              message: "Job updated successfully",
            });
          } catch (err) {
            console.error(err);
            setToast({
              type: "error",
              message: "Failed to update job",
            });
          } finally {
            setLoading(false);
          }
        }}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}