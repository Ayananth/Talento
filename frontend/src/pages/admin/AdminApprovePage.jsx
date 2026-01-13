import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FirstTimeCompanyView from "./FirstTimeCompanyView";
import AdminReviewCompanyPage from "./AdminReviewCompanyPage";
// import SideComparison from "./SideComparison";

import { getRecruiterDetails } from "../../apis/admin/utils";

const AdminApprovePage = () => {
  const { id } = useParams();

  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- Fetch recruiter details ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecruiterDetails(id);
        setRecruiter(data);
      } catch (err) {
        setError("Failed to load recruiter details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  /* ---------------- Loading & Error ---------------- */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading recruiter details…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="p-10 text-center text-gray-500">
        Recruiter not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* First-time submission */}
      {recruiter.request_type === "New" && (
        <FirstTimeCompanyView data={recruiter} />
      )}

      {/* Edit request (side-by-side diff) */}
      {recruiter.request_type === "Edit" && (
        // <SideComparison
        //   publishedData={recruiter.published_data}
        //   pendingData={recruiter.pending_data}
        // />
        <AdminReviewCompanyPage data={recruiter} />
      )}
    </div>
  );
};

export default AdminApprovePage;
