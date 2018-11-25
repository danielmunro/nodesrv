import match from "./match"

describe("matcher", () => {
  it("should match on any word", () => {
    expect(match("a foo word list", "foo")).toBe(true)
    expect(match("another word list", "foo")).toBe(false)
    expect(match("third word list where there is a partial match", "part")).toBe(true)
    expect(match("fourth descriptor", "iptor")).toBe(false)
  })
})
