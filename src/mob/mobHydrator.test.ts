import { Attributes } from "./../attributes/attributes"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/exit"
import { saveRooms } from "./../room/model"
import { Room } from "./../room/room"
import { Mob } from "./mob"
import { MobHydrator } from "./mobHydrator"
import { Race } from "./race/race"

describe("mob hydrator", () => {
  it("should be able to produce a copy of a mob from its model", () => {
    const room = new Room(
      "id",
      "name",
      "description",
      [new Exit("room-id", Direction.South)],
    )
    expect.assertions(1)
    return saveRooms([room]).then(() => {
      const mob = new Mob(
        "identifier",
        "name",
        Race.Human,
        1,
        0,
        0,
        Attributes.withNoAttributes(),
        room,
      )
      return new MobHydrator().hydrate(mob.getModel()).then((hydratedMob) => {
        expect(hydratedMob).toEqual(mob)
      })
    })
  })
})
