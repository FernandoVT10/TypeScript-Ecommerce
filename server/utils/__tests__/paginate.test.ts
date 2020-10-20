import paginate from "../paginate";

describe("Utils Paginate", () => {
    it("should get 7 pages with the 'hasPrevPage' and 'hasNextPage' active", () => {
        const pagination = paginate(100, 72);

        expect(pagination).toMatchSnapshot();
    });

    it("should get the 'hasPrevPage' and 'hasNextPage' desactive", () => {
        const pagination = paginate(1, 1);

        expect(pagination.pages.length).toBe(1);
        expect(pagination.hasPrevPage).toBeFalsy();
        expect(pagination.hasNextPage).toBeFalsy();
    });

    it("should get the 'hasPrevPage' active", () => {
        const pagination = paginate(10, 10);

        expect(pagination.pages.length).toBe(7);
        expect(pagination.hasPrevPage).toBeTruthy();
        expect(pagination.hasNextPage).toBeFalsy();
    });

    it("should get the 'hasNextPage' active", () => {
        const pagination = paginate(10, 1);

        expect(pagination.pages.length).toBe(7);
        expect(pagination.hasPrevPage).toBeFalsy();
        expect(pagination.hasNextPage).toBeTruthy();
    });
});