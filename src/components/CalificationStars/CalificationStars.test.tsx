import React from "react";

import { render } from "@testing-library/react";

import CalificationStars from "./CalificationStars";

describe("CalificationStars Component", () => {
    it("should render 5 empty stars", () => {
	const { container } = render(<CalificationStars calification={0}/>);

	expect(container.querySelectorAll(".far.fa-star")).toHaveLength(5);
    });

    it("should render 3 full stars and 2 empty stars", () => {
	const { container } = render(<CalificationStars calification={3.2}/>);

	expect(container.querySelectorAll(".fas.fa-star")).toHaveLength(3);
	expect(container.querySelectorAll(".far.fa-star")).toHaveLength(2);
    });

    it("should render 3 full stars, 1 half star and 1 empty stars", () => {
	const { container } = render(<CalificationStars calification={3.5}/>);

	expect(container.querySelectorAll(".fas.fa-star")).toHaveLength(3);
	expect(container.querySelectorAll(".fas.fa-star-half-alt")).toHaveLength(1);
	expect(container.querySelectorAll(".far.fa-star")).toHaveLength(1);
    });

    it("should render 5 full stars,", () => {
	const { container } = render(<CalificationStars calification={5}/>);

	expect(container.querySelectorAll(".fas.fa-star")).toHaveLength(5);
    });
});
