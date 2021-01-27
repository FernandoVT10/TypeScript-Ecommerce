import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, render, act } from "@testing-library/react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import EditUser from "../EditUser";

jest.mock("@/services/ApiController");

const USER_MOCK = {
    _id: "testid",
    name: "foo",
    username: "bar",
    email: "foo@bar.com",
    permits: "SUPERADMIN" as any
}

const mockedAPIPut = mocked(ApiController.put);

describe("@/domain/Dashboard/Management/Users/EditUser", () => {
    beforeEach(() => {
        jest.resetAllMocks();

        mockedAPIPut.mockResolvedValue({
            data: {
                updatedUser: {
                    ...USER_MOCK,
                    permits: "USER"
                }
            }
        });
    });

    it("should render correclty", () => {
        const { queryByText, queryByDisplayValue } = render(
            <EditUser isEditing={true} setIsEditing={jest.fn()} user={USER_MOCK} setUsers={jest.fn()}/>
        );

        expect(queryByText("foo")).toBeInTheDocument();
        expect(queryByText("bar")).toBeInTheDocument();
        expect(queryByText("foo@bar.com")).toBeInTheDocument();
        expect(queryByDisplayValue("SUPERADMIN")).toBeInTheDocument();
    });

    it("shouldn't render when the user is null", () => {
        const { container } = render(
            <EditUser isEditing={true} setIsEditing={jest.fn()} user={null} setUsers={jest.fn()}/>
        );

        expect(container.children).toHaveLength(0);
    });

    it("should call the api and setUsers to change the user permits", async () => {
        const createAlertMock = jest.fn();
        const setUsersMock = jest.fn();
        const setIsEditingMock = jest.fn();

        const { getByText, getByDisplayValue } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditUser
                    isEditing={true}
                    setIsEditing={setIsEditingMock}
                    user={USER_MOCK}
                    setUsers={setUsersMock}
                />
            </AlertsContext.Provider>
        );

        fireEvent.change(getByDisplayValue("SUPERADMIN"), { target: { value: "USER" } });
        await act(async () => fireEvent.click(getByText("Save Changes")));

        expect(mockedAPIPut).toHaveBeenCalledWith("users/testid", {
            body: { permits: "USER" }
        });

        const setUsersFunction = setUsersMock.mock.calls[0][0];
        expect(setUsersFunction([USER_MOCK])).toEqual([{
            ...USER_MOCK,
            permits: "USER"
        }]);

        expect(createAlertMock).toHaveBeenCalledWith("success", "The user has been updated successfully");
        expect(setIsEditingMock).toHaveBeenCalledWith(false);
    });

    it("should call create an alert when the api return an error", async () => {
        const createAlertMock = jest.fn();

        const { getByText, getByDisplayValue } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditUser
                    isEditing={true}
                    setIsEditing={jest.fn()}
                    user={USER_MOCK}
                    setUsers={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        mockedAPIPut.mockResolvedValue({
            error: "error",
            message: "test error"
        });

        await act(async () => fireEvent.click(getByText("Save Changes")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test error");
    });
});
