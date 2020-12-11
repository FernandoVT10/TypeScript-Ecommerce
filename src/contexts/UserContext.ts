import React from "react";

export interface IUserContextProps {
   name: string,
   username: string,
   email: string
}

export default React.createContext<IUserContextProps>(null);
