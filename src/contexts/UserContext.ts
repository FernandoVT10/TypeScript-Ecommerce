import React from "react";

export interface IUserContextProps {
   name: string,
   username: string,
   email: string,
   permits: "USER" | "ADMIN" | "SUPERADMIN"
}

export default React.createContext<IUserContextProps>(null);
