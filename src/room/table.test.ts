import { newInn } from "../area/builder/forest/inn"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import Table from "./table"

describe("room table", () => {
  it("should get exits for a mob", async () => {
    // setup
    const root = getTestRoom()
    const areaBuilder = await newInn(root)
    const mob = getTestMob()
    root.addMob(mob)

    // when
    const table = Table.new(areaBuilder.getAllRooms())

    // then
    expect(table.exitsForMob(mob).length).toEqual(mob.room.exits.length)
  })
})
