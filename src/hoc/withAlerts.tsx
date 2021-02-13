import React from "react";

import Alerts from "@/components/Alerts";

import AlertsContext from "@/contexts/AlertsContext";

interface ComponentState {
    alerts: {
        id: string,
        type: string,
        message: string
    }[]
}

const MILISECONDS_TO_CLOSE = 5000;

const withAlerts = <T extends object>(Component: React.ComponentType<T>) => {
    return class extends React.Component<T, ComponentState> {
        alertOptions = {
            createAlert: this.createAlert.bind(this)
        }

	state = {
            alerts: []
	}

        createAlert(type: string, message: string) {
            const id = Math.random().toString(36);

            this.setState({
                alerts: [...this.state.alerts, {
                    id,
                    type,
                    message
                }]
            });

            setTimeout(() => this.closeAlert(id), MILISECONDS_TO_CLOSE);
        }

        closeAlert(alertId: string) {
            this.setState({
                alerts: this.state.alerts.filter(alert => alert.id !== alertId)
            });
        }

	render() {
	    return (
		<AlertsContext.Provider value={this.alertOptions}>
                    <Alerts
                        alerts={this.state.alerts}
                        closeAlert={this.closeAlert.bind(this)}
                    />

		    <Component { ...this.props }/>
		</AlertsContext.Provider>
	    );
	}
    }
}

export default withAlerts;
