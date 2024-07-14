// src/contexts/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  return (
    <UserContext.Provider value={{ userProfilePicture, setUserProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};
