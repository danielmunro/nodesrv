import multiplierNormalizer from "./multiplierNormalizer"

describe("Multiplier normalizer", () => {
  it("creates a small multiplier from negative values", () => {
    // given
    const largeNegative = multiplierNormalizer(-10)
    const smallNegative = multiplierNormalizer(-1)

    // then
    expect(largeNegative).toBeLessThan(smallNegative)
    expect(smallNegative).toBeLessThan(1)
  })

  it("reduces large multipliers", () => {
    // given
    const largePositive = multiplierNormalizer(100)
    const smallPositive = multiplierNormalizer(20)

     // then
    expect(largePositive).toBeGreaterThan(smallPositive)
    expect(smallPositive).toBeLessThan(15)
  })
})
