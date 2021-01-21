import React, { useContext } from "react";

import { fireEvent, render } from "@testing-library/react";

import AlertsContext from "@/contexts/AlertsContext";

import withAlerts from "../withAlerts";

const COMPONENT_MOCK = () => {
    const alertOptions = useContext(AlertsContext)

    return (
        <div>
            <button
                onClick={() => alertOptions.createAlert("danger", "dangerous message")}
            >
                Create Alert
            </button>
        </div>
    );
}

const renderComponent = () => {
    const Component = withAlerts(COMPONENT_MOCK);
    return render(<Component/>);
}

jest.useFakeTimers();

describe("@/hoc/withAlerts", () => {
    it("should create an alert correctly", () => {
        const { getByText, queryByText } = renderComponent();

        fireEvent.click(getByText("Create Alert"));

        expect(queryByText("dangerous message")).toBeInTheDocument();

        jest.runAllTimers();
    });

    it("should close an alert correctly", () => {
        const { getByText, queryByText, getByTestId } = renderComponent();

        fireEvent.click(getByText("Create Alert"));
        expect(queryByText("dangerous message")).toBeInTheDocument();
        fireEvent.click(getByTestId("alert-close-button"));
        expect(queryByText("dangerous message")).not.toBeInTheDocument();

        jest.runAllTimers();
    });

    it("should close the alert after 5 seconds", () => {
        const { getByText, queryByText } = renderComponent();

        const timeoutSpyOn = jest.spyOn(window, "setTimeout");

        fireEvent.click(getByText("Create Alert"));
        expect(queryByText("dangerous message")).toBeInTheDocument();

        expect(timeoutSpyOn).toHaveBeenCalledWith(expect.any(Function), 5000);

        jest.runAllTimers();

        expect(queryByText("dangerous message")).not.toBeInTheDocument();
    });
});
