import { allTerrains } from "./constants"
import { Terrain } from "./enum/terrain"
import getMovementCost from "./movementCost"

describe("movement cost calculator for regions", () => {
  it("settlements should have the lowest movement cost", () => {
    const cost = getMovementCost(Terrain.Settlement)
    allTerrains
      .filter((terrain) => terrain !== Terrain.Settlement)
      .forEach((terrain) => expect(cost).toBeLessThan(getMovementCost(terrain)))
  })
})
