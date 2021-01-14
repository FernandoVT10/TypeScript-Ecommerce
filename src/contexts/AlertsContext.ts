import React from "react";

interface IAlertsContextProps {
    createAlert: (type: string, message: string) => void
}

export default React.createContext<IAlertsContextProps>(null);
