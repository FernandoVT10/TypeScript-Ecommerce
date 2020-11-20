import { renderHook, act } from "@testing-library/react-hooks";

import useInputHandling from "../useInputHandling";

describe("Use Input Handling Hook", () => {
    it("should set the error correctly", () => {
	const { result } = renderHook(() => useInputHandling(""));
        
	act(() => result.current.setError("test error"));

	expect(result.current.error).toBe("test error");
    });
    it("should set the value and clean the error correctly", () => {
	const { result } = renderHook(() => useInputHandling(""));

	act(() => result.current.setError("test error"));

	act(() => result.current.setValue("test value"));

	expect(result.current.error).toBe("");
	expect(result.current.value).toBe("test value");
    });
});
