import { double } from "../double";

const mock$add = jest.fn();
jest.mock("../add", () => ({
  add(...args: unknown[]) {
    return mock$add(...args);
  },
}));

describe("double", () => {
  it("2*2=4", () => {
    mock$add.mockReturnValueOnce(4);
    expect(double(2)).toBe(4);
    expect(mock$add).toBeCalledTimes(1);
    expect(mock$add).toBeCalledWith(2, 2);
  });
  it("3*2=6", () => {
    mock$add.mockReturnValueOnce(6);
    expect(double(3)).toBe(6);
    expect(mock$add).toBeCalledTimes(1);
    expect(mock$add).toBeCalledWith(3, 3);
  });
});
