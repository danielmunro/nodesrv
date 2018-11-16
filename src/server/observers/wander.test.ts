import { Direction } from "../../room/constants"
import { newExit } from "../../room/factory"
import Service from "../../service/service"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { Wander } from "./wander"

describe("wander", () => {
  it("should cause a mob to move", async () => {
    const mob = getTestMob()

    // given
    mob.wanders = true
    const source = getTestRoom()
    source.addMob(mob)
    source.name = "room 1"
    const destination = getTestRoom()
    destination.name = "room 2"
    const allRooms = [source, destination]
    const exit = newExit(Direction.South, source, destination)
    const service = await Service.newWithArray(allRooms, [exit])
    const wander = new Wander(service, [mob])

    // when
    await wander.notify([])

    // then
    expect(mob.room.name).toBe(destination.name)
  })
})
