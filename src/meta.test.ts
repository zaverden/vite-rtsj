export {}; // ts(1218) hack

describe("vite meta", () => {
  it("should have env.VITE_APP_TITLE from .env.development", () => {
    expect(import.meta.env.VITE_APP_TITLE).toBe("title.env.development");
  });
  it("should have url", () => {
    expect(import.meta.url).toMatch(/^file:\/\/(.*)meta.test.ts$/);
  });
  it("should work with hot", () => {
    expect(import.meta.hot).toBeUndefined();
  });
});
