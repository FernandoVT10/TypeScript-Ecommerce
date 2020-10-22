import React from "react";

import { render } from "@testing-library/react";

import Home from "./Home";

const HOME_PROPS_MOCK = {
    carouselItems: [
        {
            _id: "test-id",
            image: "carousel-test-1.jpg",
            link: "https://example.com"
        }
    ],
    promotions: [
        {
            _id: "test-id",
            image: "test-1.jpg",
            title: "promotion title",
            link: "https://example.com"
        }
    ],
    recentProducts: [
        {
            _id: "test-id-1",
            images: ["test-1.jpg"],
            title: "test recent product title",
            price: 18,
            discount: 50,
            description: "test description"
        }
    ],
    discountProducts: [
        {
            _id: "test-id-1",
            images: ["test-1.jpg"],
            title: "test discount product title",
            price: 18,
            discount: 50,
            description: "test description"
        }
    ]
}

describe("Domain Home", () => {
    it("should render correctly", () => {
        const { queryByAltText, queryByText } = render(<Home {...HOME_PROPS_MOCK}/>);

        expect(queryByAltText("Carousel Image")).toBeInTheDocument();
        expect(queryByText("promotion title")).toBeInTheDocument();
        expect(queryByText("test recent product title")).toBeInTheDocument();
        expect(queryByText("test discount product title")).toBeInTheDocument();
    });
});