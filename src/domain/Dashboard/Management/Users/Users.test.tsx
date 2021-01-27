import React from "react";
import { mocked } from "ts-jest/utils";

import { render, act, screen, fireEvent } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import Users from "./Users";

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);
jest.mock("@/services/ApiController");

const USERS_MOCK = [
    {
        _id: "testid",
        name: "foo",
        username: "bar",
        email: "foo@bar.com",
        permits: "SUPERADMIN" as any
    }
];

const PAGINATION_MOCK = {
    totalPages: 5,
    page: 1,
    hasPrevPage: false,
    prevPage: null,
    hasNextPage: true,
    nextPage: 2
}

const mockedAPIGet = mocked(ApiController.get);

describe("@/domain/Dashboard/Management/Users", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();

        mockedAPIGet.mockResolvedValue({
            data: {
                users: USERS_MOCK,
                ...PAGINATION_MOCK
            }
        });
    });

    it("should render and call the api", async () => {
        changeRouterProperties({
            query: { search: "test search" }
        });

        await act(async () => render(<Users/>));

        expect(screen.queryByDisplayValue("test search")).toBeInTheDocument();

        expect(screen.queryByText("foo")).toBeInTheDocument();
        expect(screen.queryByText("bar")).toBeInTheDocument();
        expect(screen.queryByText("SUPERADMIN")).toBeInTheDocument();
    });

    it("should render 'results not found' message", async () => {
        mockedAPIGet.mockResolvedValue({
            users: []
        });

        await act(async () => render(<Users/>));

        expect(screen.queryByText("Results not found")).toBeInTheDocument();

        expect(screen.queryByText("foo")).not.toBeInTheDocument();
        expect(screen.queryByText("bar")).not.toBeInTheDocument();
    });

    it("should activate the edit user modal", async () => {
        await act(async () => render(<Users/>));
        
        fireEvent.click(screen.getByTestId("users-edit-button"));

        expect(screen.queryAllByText("foo")).toHaveLength(2);
        expect(screen.queryAllByText("bar")).toHaveLength(2);
        expect(screen.queryByText("foo@bar.com")).toBeInTheDocument();
    });
});
