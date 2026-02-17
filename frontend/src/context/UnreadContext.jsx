import React, {createContext, useContext, useState} from "react";


const UnreadContext = createContext(null);

export function UnreadProvider({children}) {
    const [totalUnread, setTotalUnread] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    return(
        <UnreadContext.Provider
            value={{
                totalUnread,
                setTotalUnread,
                unreadNotificationsCount,
                setUnreadNotificationsCount,
            }}
        >
            {children}
        </UnreadContext.Provider>
    )
}

export function useUnread(){
    return useContext(UnreadContext);
}
