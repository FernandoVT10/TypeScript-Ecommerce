import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Alerts from "./Alerts";

const ALERTS_MOCK = [
    {
        id: "id-1",
        type: "danger",
        message: "Dangerous message"
    },
    {
        id: "id-2",
        type: "success",
        message: "Successful message"
    }
];

describe("@/components/Alerts", () => {
    it("should render correclty", () => {
        const { queryByText } = render(<Alerts alerts={ALERTS_MOCK} closeAlert={jest.fn()}/>);

        expect(queryByText("Dangerous message")).toBeInTheDocument();
        expect(queryByText("Successful message")).toBeInTheDocument();
    });

    it("should call closeAlert when we click on the close button", () => {
        const closeAlertMock = jest.fn();

        const { getAllByTestId } = render(<Alerts alerts={ALERTS_MOCK} closeAlert={closeAlertMock}/>);

        fireEvent.click(getAllByTestId("alert-close-button")[1]);

        expect(closeAlertMock).toHaveBeenCalledWith("id-2");
    });
});
