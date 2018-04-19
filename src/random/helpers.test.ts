import { pickOne } from "./helpers"

describe("helpers", () => {
  it("pickOne should be able to pick one element randomly out of an array", () => {
    const arbitraryValues = [1, 2, 3, 4, 5]
    const picked = pickOne(arbitraryValues)
    expect(arbitraryValues.find((v) => v === picked)).toBeTruthy()
  })

  it("pickOne should not be able to pick from an empty array", () => {
    expect(pickOne([])).toBeUndefined()
  })
})
