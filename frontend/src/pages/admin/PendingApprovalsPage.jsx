import React, { useState, useEffect } from "react";
import { getPendingList } from "@/apis/admin/getPendingList";
import useAuth from "@/auth/context/useAuth";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import ResponsiveTable from "@//components/admin/ResponsiveTable";
import { useNavigate } from "react-router-dom";



export default function PendingApprovalsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");
  const pageSize = PAGE_SIZE;
  const totalPages = Math.ceil(count / pageSize);
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate()

  const fetchData = async (pageNum, orderingValue = ordering) => {
    const response = await getPendingList(pageNum, orderingValue);
    console.log("response: " , response)

    const mapped = response.results.map((item) => ({
      id: item.id,
      user: item.username,
      company: item.company_name,
      status: item.status,
      request_type: item.request_type?.toLowerCase(),
      submitted: new Date(item.updated_at).toLocaleString(),
    }));

    setData(mapped);
    setCount(response.count);
  };

  useEffect(() => {
    if (!authLoading) fetchData(page);
  }, [authLoading, page, ordering]);

  const handleSort = (orderingKey) => {
    if (!orderingKey) return;

    if (ordering === orderingKey) {
      setOrdering(`-${orderingKey}`);      // ascending → descending
    } else if (ordering === `-${orderingKey}`) {
      setOrdering("");                     // descending → reset
    } else {
      setOrdering(orderingKey);            // no sort → ascending
    }

    setPage(1); // reset page
  };



  const columns = [
    {
      label: "No",
      key: "number",
      sortable: false,
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },

    {
      label: "User",
      key: "user",
      sortable: true,
      orderingKey: "user__username", 
    },

    {
      label: "Company",
      key: "company",
      sortable: true,
      orderingKey: "company_name", 
    },

    {
      label: "Request Type",
      key: "request_type",
      sortable: true,
      orderingKey: "request_type",
    },

    {
      label: "Status",
      key: "status",
      sortable: true,
      orderingKey: "status",
    },

    {
      label: "Submitted",
      key: "submitted",
      sortable: true,
      orderingKey: "created_at", 
    },
  ];

  console.log("data", data)


  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pending Approvals
      </h2>

      <ResponsiveTable
        data={data}
        columns={columns}
        rowKey="id"
        actions={(row) => (
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={()=> navigate(`${row.id}`)}>
            View
          </button>
        )}
        ordering={ordering}
        onSort={handleSort}

/>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(num) => setPage(num)}
      />
    </div>
  );
}