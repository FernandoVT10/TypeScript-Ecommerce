import React from "react";

import { render } from "@testing-library/react";

import PromoCard from "./PromoCard";

const PROMOTION_MOCK = {
    _id: "test-id",
    image: "test-1.jpg",
    title: "test title",
    link: "https://example.com"
}

describe("Domain Home PromoCard", () => {
    it("should render correclty", () => {
        const { queryByText, queryByAltText } = render(<PromoCard promotionDetails={PROMOTION_MOCK}/>);

        expect(queryByAltText("Promo Image")).toHaveAttribute("src", "/img/promotions/thumb-test-1.jpg");
        expect(queryByText("test title")).toBeInTheDocument();
        expect(queryByText("See more")).toHaveAttribute("href", "https://example.com");
    });
});
