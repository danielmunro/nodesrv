import getMovementCost from "./movementCost"
import { allTerrains, Terrain } from "./terrain"

describe("movement cost calculator for regions", () => {
  it("settlements should have the lowest movement cost", () => {
    const cost = getMovementCost(Terrain.Settlement)
    allTerrains
      .filter((terrain) => terrain !== Terrain.Settlement)
      .forEach((terrain) => expect(cost).toBeLessThan(getMovementCost(terrain)))
  })
})
