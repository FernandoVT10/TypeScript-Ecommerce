import React from "react";

import getPages, { getMinAndMax } from "../GetPaginationPages";

describe("Services GetPaginationPages", () => {
    describe("GetMinAndMax Function", () => {
	it("should get 4 and 8 with the maxPages in 5", () => {
	    expect(getMinAndMax({
		totalPages: 10,
		currentPage: 6,
		maxPages: 5
	    })).toEqual([4, 8]);
	});
	
	it("should get 1 and 5", () => {
	    expect(getMinAndMax({
		totalPages: 10,
		currentPage: 1,
		maxPages: 5
	    })).toEqual([1, 5]);
	});

	it("should get 5 and 10", () => {
	    expect(getMinAndMax({
		totalPages: 10,
		currentPage: 9,
		maxPages: 5
	    })).toEqual([6, 10]);
	});
    });

    describe("GetPages Function", () => {
	it("should get the pages from 4 to 8", () => {
	    const pages = getPages({
		totalPages: 10,
		currentPage: 6,
		maxPages: 5
	    });

	    expect(pages.length).toBe(5);
	    expect(pages[0].pageNumber).toBe(4);
	    expect(pages[4].pageNumber).toBe(8);
	});

	it("should get the pages with the second page active", () => {
	    const pages = getPages({
		totalPages: 10,
		currentPage: 2,
		maxPages: 5
	    });

	    expect(pages[1].active).toBeTruthy();
	});
    });
});
