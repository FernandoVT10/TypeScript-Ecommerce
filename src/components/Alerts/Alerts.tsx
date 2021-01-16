import React from "react";

import styles from "./Alerts.module.scss";

interface AlertsProps {
    alerts: {
        id: string,
        type: string,
        message: string
    }[],
    closeAlert: (alertId: string) => void
}

const Alerts = ({ alerts, closeAlert }: AlertsProps) => {
    return (
        <div className={styles.alerts}>
            {alerts.map((alert, index) => {
                return (
                    <div className={`${styles.alert} ${styles[alert.type]}`} key={index}>
                        { alert.message }

                        <button
                            className={styles.closeButton}
                            onClick={() => closeAlert(alert.id)}
                            data-testid="alert-close-button"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default Alerts;
