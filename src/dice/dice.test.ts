import roll, { coinFlip,  DiceRoller, onCoinFlipSuccess } from "./dice"

const rollDataSet = [
  [1, 4],
  [2, 2],
  [2, 6],
  [2, 20],
  [4, 4],
  [4, 5],
  [6, 12],
  [8, 2],
  [20, 2],
  [20, 20],
  [20, 100],
]

const TEST_FLIP_COUNT = 100

describe("dice roller", () => {
  it("should always be sane (within min/max possibilities)", () => {
    rollDataSet.map((d) => {
      const expectation = expect(roll(d[0], d[1]))

      // if every dice roll returns 1:
      expectation.toBeGreaterThanOrEqual(d[0])

      // if every dice roll returns its max value:
      expectation.toBeLessThanOrEqual(d[0] * d[1])
    })
  })

  it("class wrapper should be sane as well", () => {
    rollDataSet.map((d) => {
      const expectation = expect(new DiceRoller(d[1], d[0], 0).getRoll())

      // if every dice roll returns 1:
      expectation.toBeGreaterThanOrEqual(d[0])

      // if every dice roll returns its max value:
      expectation.toBeLessThanOrEqual(d[0] * d[1])
    })
  })

  it("coin flip should return a random boolean for every test call", () => {
    const results = []

    for (let i = 0; i < TEST_FLIP_COUNT; i++) {
      results.push(coinFlip())
    }

    expect(results.some((r) => r === true))
    expect(results.some((r) => r === false))
  })

  it("onCoinFlipSuccess should only call the callback when the flip is successful", () => {
    const results = []
    const successCallback = jest.fn()

    for (let i = 0; i < TEST_FLIP_COUNT; i++) {
      results.push(onCoinFlipSuccess(successCallback))
    }

    expect(successCallback.mock.calls.length).toBeLessThan(TEST_FLIP_COUNT)
  })
})
