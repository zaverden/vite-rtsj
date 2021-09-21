import {} from "jest"; // ts(1218) hack


describe("vite env", () => {
  it("should have VITE_APP_TITLE from .env.development", () => {
    expect(import.meta.env.VITE_APP_TITLE).toBe("title.env.development");
  });
});
