import React, { createContext, useContext, useState } from "react";

const AdminUnreadContext = createContext(null);

export function AdminUnreadProvider({ children }) {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  return (
    <AdminUnreadContext.Provider
      value={{
        unreadNotificationsCount,
        setUnreadNotificationsCount,
      }}
    >
      {children}
    </AdminUnreadContext.Provider>
  );
}

export function useAdminUnread() {
  return useContext(AdminUnreadContext);
}
