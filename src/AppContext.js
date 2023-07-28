import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [customerId, setCustomerId] = useState('');

    return (
        <AppContext.Provider value={{ user, setUser, customerId, setCustomerId }}>
            {children}
        </AppContext.Provider>
    );
};
