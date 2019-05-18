import { modifierNormalizer } from "./attack"

describe("Multiplier normalizer", () => {
  it("creates a small multiplier from negative values", () => {
    // given
    const largeNegative = modifierNormalizer(-10)
    const smallNegative = modifierNormalizer(-1)

    // then
    expect(largeNegative).toBeLessThan(smallNegative)
    expect(smallNegative).toBeLessThan(1)
  })

  it("reduces large multipliers", () => {
    // given
    const largePositive = modifierNormalizer(100)
    const smallPositive = modifierNormalizer(20)

     // then
    expect(largePositive).toBeGreaterThan(smallPositive)
    expect(smallPositive).toBeLessThan(15)
  })
})
