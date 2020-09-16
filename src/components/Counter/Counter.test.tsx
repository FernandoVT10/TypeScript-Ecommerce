import React from "react";

import { render, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

describe("<Counter/> Component", () => {
    it("should render correctly", async () => {
        const counter = render(<Counter/>);

        const span = await counter.findByText("0");

        expect(span.textContent).toBe("0");
    });

    it("should add 1 to the counter", async () => {
        const { findByText, container } = render(<Counter/>);

        const span = await findByText("0");

        fireEvent.click(container.querySelector("button"));

        expect(span.textContent).toBe("1");
    });
});
