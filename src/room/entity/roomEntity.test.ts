import {allTerrains} from "../../region/constants"
import {RegionEntity} from "../../region/entity/regionEntity"
import {Terrain} from "../../region/enum/terrain"
import {getTestRoom} from "../../support/test/room"

describe("room entity", () => {
  it("settlements should have the lowest movement cost", () => {
    const room = getTestRoom()
    room.region = new RegionEntity()
    room.region.terrain = Terrain.Settlement
    const cost = room.getMovementCost()
    allTerrains
      .filter(terrain => terrain !== Terrain.Settlement)
      .forEach(terrain => {
        room.region.terrain = terrain
        expect(cost).toBeLessThan(room.getMovementCost())
      })
  })
})
