import React, { createContext, useEffect, useState, useContext } from "react";
import api from "../apis/api";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [pendingNew, setPendingNew] = useState(null);
  const [Contextloading, setLoading] = useState(false);

  const fetchPendingCounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/admin/pending-counts/");
      console.log(res.data.pending)
      setPendingNew(res.data.pending);
    } catch (err) {
      console.error("Failed to fetch pending counts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCounts();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        pendingNew,
        Contextloading,
        fetchPendingCounts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
};