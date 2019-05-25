import withValue from "./withValue"

describe("with value", () => {
  it("sanity check -- passes a string through", () => {
    // expect
    expect(withValue("foo", (value: string) => value)).toBe("foo")
  })

  it("another sanity check", () => {
    // expect
    const arbitrary = 1
    expect(withValue(arbitrary === 1 ? 1 : 2, (value: any) => value)).toBe(1)
  })
})
