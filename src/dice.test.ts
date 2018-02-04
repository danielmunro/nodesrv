import roll from "./dice"

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

test("dice roll should always be within specified min/max", () => {
  rollDataSet.map((d) => {
    const expectation = expect(roll(d[0], d[1]))
    
    // if every dice roll returns 1:
    expectation.toBeGreaterThanOrEqual(d[0])
    
    // if every dice roll returns its max value:
    expectation.toBeLessThanOrEqual(d[0] * d[1])
  })
})
