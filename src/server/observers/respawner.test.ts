import { Disposition } from "../../mob/disposition"
import { default as MobTable } from "../../mob/table"
import { default as RoomTable } from "../../room/table"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import Respawner from "./respawner"

describe("respawner", () => {
  it("should reset dispositions for dead mobs", async () => {
    // setup
    const startRoom = getTestRoom()

    // dead
    const mob1 = getTestMob()
    mob1.disposition = Disposition.Dead
    mob1.reset.disposition = Disposition.Standing
    mob1.reset.room = startRoom

    // dead
    const mob2 = getTestMob()
    mob2.disposition = Disposition.Dead
    mob2.reset.disposition = Disposition.Sitting
    mob2.reset.room = startRoom

    // not dead
    const mob3 = getTestMob()
    mob3.disposition = Disposition.Sitting
    mob3.reset.disposition = Disposition.Standing
    mob3.reset.room = startRoom

    // given
    const respawner = new Respawner(RoomTable.new([startRoom]), new MobTable([mob1, mob2, mob3]))

    // when
    await respawner.notify([])

    // then
    expect(mob1.disposition).toBe(Disposition.Standing)
    expect(mob1.room).toBe(startRoom)
    expect(mob2.disposition).toBe(Disposition.Sitting)
    expect(mob2.room).toBe(startRoom)
    expect(mob3.disposition).toBe(Disposition.Sitting)
    expect(mob3.room).not.toBe(startRoom)
  })
})
